import {action, computed, makeObservable, observable} from 'mobx';

class Loader {
  private _loaders: Set<string> = new Set(['load']);
  private _displayed: boolean = true;

  public constructor() {
    makeObservable<typeof this, '_displayed'>(this, {
      _displayed: observable.ref,
      displayed: computed,
      add: action.bound,
      remove: action.bound,
    });
  }

  public get displayed(): boolean {
    return this._displayed;
  }

  public add(name: string): void {
    this._loaders.add(name);

    this.update();
  }

  public remove(name: string): void {
    this._loaders.delete(name);

    this.update();
  }

  // private:

  private update() {
    this._displayed = this._loaders.size > 0;
  }
}

export const loader = new Loader();