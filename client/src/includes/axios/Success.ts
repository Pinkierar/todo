import {GoodCode, JwtData, Status, SureObject} from '#global';

export type SuccessData<D extends SureObject> = D & Partial<JwtData> & {
  hash: string
};

export class Success<D extends SureObject> {
  public readonly status = Status.success;

  public constructor(code: GoodCode, data: SuccessData<D>) {
    this._code = code;
    this._data = data;
  }

  public get code() {
    return this._code;
  }

  public get data() {
    return this._data;
  }

  private readonly _code: GoodCode;
  private readonly _data: SuccessData<D>;
}