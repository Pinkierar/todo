import {BadCode, Status} from '#global';

export class Fail extends Error {
  public readonly status = Status.fail;

  public constructor(code: BadCode, message: string, errors: any[]) {
    super(Fail.normalizeMessage(message));

    this._code = code;
    this._errors = errors;
  }

  public get code() {
    return this._code;
  }

  public get errors() {
    return this._errors;
  }

  private readonly _code: BadCode;
  private readonly _errors: any[];

  private static normalizeMessage(data: any): string {
    if (!data) return '';
    if (typeof data === 'string') return data;
    if (data.message) return data.message;

    try {
      return JSON.stringify(data);
    } catch (e) {
      return JSON.stringify(Object
        .keys(data)
        .filter(key => !(data[key] instanceof Function))
        .map(key => String(data[key])),
      );
    }
  }
}