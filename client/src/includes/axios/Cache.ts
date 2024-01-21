import {HttpMethod, httpMethodToMethod, SureObject, UserData} from '#global';

export class Cache<D extends { access?: string, user?: UserData, hash: string }> {
  private readonly _name: string;
  private _data!: D;
  private _hash!: string;

  public constructor(name: string, data: D)
  public constructor(httpMethod: HttpMethod, url: string, data: D)
  public constructor(arg1: string | HttpMethod, arg2: D | string, arg3?: D) {
    if (arg3) {
      this._name = Cache.createName(arg1 as HttpMethod, arg2 as string);
      this.update(arg3 as D);
    } else {
      this._name = arg1 as string;
      this.update(arg2 as D);
    }
  }

  public get name(): string {
    return this._name;
  }

  public get data(): Readonly<D> {
    return this._data;
  }

  public get hash(): string {
    return this._hash;
  }

  public update(data: D): void {
    const {user, access, ...dataWithoutUser} = data;
    const jsonData = JSON.stringify(dataWithoutUser);

    window.localStorage.setItem(Cache.prefix + this._name, jsonData);

    this._data = JSON.parse(jsonData);
    this._hash = this._data.hash;
  }

  public remove() {
    Cache.remove(this._name);
  }

  public static byLocalStorage<D extends SureObject & { hash: string }>(
    name: string,
  ): Cache<D> | undefined {
    const jsonData = window.localStorage.getItem(Cache.prefix + name);

    if (!jsonData) return undefined;

    const data: D = JSON.parse(jsonData);

    return new Cache<D>(name, data);
  }

  public static remove(name: string) {
    window.localStorage.removeItem(Cache.prefix + name);
  }

  public static createName(httpMethod: HttpMethod, url: string): string {
    return `${httpMethodToMethod(httpMethod)} ${url}`;
  }

  private static readonly prefix = 'cache response ';
}