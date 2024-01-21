import {action, computed, makeObservable, observable} from 'mobx';
import {Status} from '#global';

export type RequestItem = {
  id: number,
  path: string,
  status: Status | -1,
  displayed: boolean,
};

class Requests {
  private static _counter: number = 0;

  private _items: RequestItem[] = [];

  public constructor() {
    makeObservable<typeof this, '_items'>(this, {
      _items: observable.deep,
      items: computed,
      add: action.bound,
      setStatus: action.bound,
      remove: action.bound,
    });
  }

  public get items() {
    return this._items;
  }

  public add(path: RequestItem['path']): RequestItem['id'] {
    this._items.push({
      id: ++Requests._counter,
      path: path,
      status: -1,
      displayed: true,
    });

    return Requests._counter;
  }

  public setStatus(id: RequestItem['id'], status: Status): void {
    this._items[this.getIndexById(id)].status = status;

    new Promise(resolve => window.setTimeout(resolve, 2000)).then(() => this.remove(id));
  }

  public remove(id: RequestItem['id']) {
    this._items[this.getIndexById(id)].displayed = false;
  }

  private getIndexById(id: RequestItem['id']): number {
    const index = this._items.findIndex(item => item.id === id);

    if (index === -1) throw new Error('Log by id not found');

    return index;
  }
}

export const requests = new Requests();