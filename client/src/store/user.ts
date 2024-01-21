import {UserData} from '#global';
import {ApiRoute} from '#includes/ApiRoute';
import {SuperError} from '#includes/error';
import {action, computed, makeObservable, observable} from 'mobx';

class User {
  private _current: UserData | null = null;

  public constructor() {
    this._current = User.getDataByStorage();

    makeObservable<typeof this, '_current'>(this, {
      _current: observable.struct,
      current: computed,
      authorized: computed,
      setData: action.bound,
      clear: action.bound,
    });

    window.setTimeout(() => ApiRoute.getToken.request());
  }

  public get authorized(): boolean {
    return this._current !== null;
  }

  public get current(): UserData | null {
    return this._current;
  }

  public setData(data: UserData): void {
    window.localStorage.user = JSON.stringify(data);

    this._current = data;
  }

  public clear(): void {
    this._current = null;

    delete window.localStorage.user;
  }

  private static validateUserData(data: unknown): UserData {
    if (typeof data !== 'object' || !data) throw new SuperError(
      `${this.constructor.name}.${this.validateUserData.name}`,
      'data is not object',
    );

    if (!('id' in data) || typeof data.id !== 'number') throw new SuperError(
      `${this.constructor.name}.${this.validateUserData.name}`,
      'data.id is not number',
    );

    if (!('name' in data) || typeof data.name !== 'string') throw new SuperError(
      `${this.constructor.name}.${this.validateUserData.name}`,
      'data.name is not string',
    );

    if (!('email' in data) || typeof data.email !== 'string') throw new SuperError(
      `${this.constructor.name}.${this.validateUserData.name}`,
      'data.email is not string',
    );

    if (!('confirmed' in data) || typeof data.confirmed !== 'boolean') throw new SuperError(
      `${this.constructor.name}.${this.validateUserData.name}`,
      'data.confirmed is not boolean',
    );

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      confirmed: data.confirmed,
    };
  }

  private static getDataByStorage(): User['_current'] {
    if (!('user' in window.localStorage)) return null;

    try {
      const userInStorage = JSON.parse(window.localStorage['user']);
      return User.validateUserData(userInStorage);
    } catch (e) {
      delete window.localStorage['user'];
      return null;
    }
  }
}

type UserWithOrWithoutData = Readonly<{
  authorized: true,
  current: UserData,
} | {
  authorized: false,
  current: null,
}>

export const user = (new User()) as User & UserWithOrWithoutData;