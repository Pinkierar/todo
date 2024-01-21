import {action, computed, makeObservable, observable} from 'mobx';
import {SuperError} from '#includes/error';

export enum NotificationType {
  info = 1,
  warn,
  error,
}

export type NotificationItem = {
  id: number,
  content: string,
  type: NotificationType,
  displayed: boolean,
};

class Notifications {
  private _lastId: number = 0;
  private _items: NotificationItem[] = [];

  public constructor() {
    makeObservable<typeof this, '_items' | 'remove' | 'add'>(this, {
      _items: observable.deep,
      items: computed,
      addInfo: action.bound,
      addWarn: action.bound,
      addError: action.bound,
      add: action.bound,
      remove: action.bound,
    });
  }

  public get items() {
    return this._items;
  }

  public addInfo(content: NotificationItem['content']): void {
    this.add(NotificationType.info, content);
  }

  public addWarn(content: NotificationItem['content']): void {
    this.add(NotificationType.warn, content);
  }

  public addError(error: NotificationItem['content'] | Error): void {
    if (error instanceof SuperError)
      return this.add(NotificationType.error, `${error.sender}: ${error.message}`);

    if (error instanceof Error)
      return this.add(NotificationType.error, error.message);

    this.add(NotificationType.error, error);
  }

  //

  private add(type: NotificationItem['type'], content: NotificationItem['content']): void {
    const notification = this.create(type, content);

    this._items.push(notification);

    setTimeout(() => this.remove(notification.id), 5000);
  }

  private create(type: NotificationItem['type'], content: NotificationItem['content']): NotificationItem {
    this._lastId++;

    return {
      id: this._lastId,
      type: type,
      content: content,
      displayed: true,
    };
  }

  private remove(id: NotificationItem['id']) {
    this._items.splice(this.getById(id), 1);
  }

  private getById(id: NotificationItem['id']) {
    return this._items.findIndex(item => item.id === id);
  }
}

export const notifications = new Notifications();