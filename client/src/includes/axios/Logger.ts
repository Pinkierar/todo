import {HttpMethod, httpMethodToMethod} from '#global';
import {urls} from '#config';

type Message = {
  content: any,
  color?: string,
};

export class Logger {
  private readonly _title: string;

  private readonly _url: string;
  private _args: Message[] = [];
  private _data: Message[] = [];

  public constructor(type: HttpMethod, url: string) {
    this._url = url;

    const clearedUrl = url.replace(/\?.+/, '');
    this._title = `${httpMethodToMethod(type).toUpperCase()} ${clearedUrl}`;
  }

  public run() {
    console.groupCollapsed(this._title);

    Logger.log(
      this._url.startsWith('http')
        ? this._url
        : `${urls.backend}/${this._url}`,
      '#FF0',
    );

    this._args.length > 0 && Logger.group('>', this._args);
    this._data.length > 0 && Logger.group('<', this._data);

    console.groupEnd();
  }

  public addArgsItem(args: Message) {
    this._args.push(args);
  }

  public addDataItem(data: Message) {
    this._data.push(data);
  }

  //

  private static group(group: string, messages: Message[]) {
    console.group(group);

    messages.forEach(
      ({content, color}) => (
        Logger.log(content, color)
      ),
    );

    console.groupEnd();
  }

  private static log(content: any, color?: string) {
    if (typeof content === 'string' && color) {
      console.log(`%c${content}`, `color: ${color}`);
    } else {
      console.log(content);
    }
  }
}