import {HttpMethod, SureObject} from '../';

export type ParsedQs = {
  [key: string]: undefined | string | number | string[] | number[] | ParsedQs | ParsedQs[]
};

export class g_Route<
  P extends { [p: string]: string | number } | null = null,
  D extends SureObject = {},
  A = undefined,
  Q extends ParsedQs | undefined = undefined,
> {
  public readonly _typeP: P = 0 as any;
  public readonly _typeD: D = 0 as any;
  public readonly _typeA: A = 0 as any;
  public readonly _typeQ: Q = 0 as any;

  private readonly _httpMethod: HttpMethod;
  private readonly _path: string;
  private readonly _description: string;
  private readonly _isDisabledCash: boolean;

  public constructor(httpMethod: HttpMethod.get, path: string, description: string, isDisabledCash: boolean)
  public constructor(httpMethod: HttpMethod, path: string, description: string)
  public constructor(routeObject: g_Route<P, D, A, Q>)
  public constructor(
    arg1: g_Route<P, D, A, Q> | HttpMethod,
    path?: string,
    description?: string,
    isDisabledCash: boolean = false,
  ) {
    if (typeof arg1 === 'object') {
      this._httpMethod = arg1.httpMethod;
      this._path = arg1.path;
      this._description = arg1.description;
      this._isDisabledCash = arg1.isDisabledCash;
    } else {
      this._httpMethod = arg1;
      this._path = path!;
      this._description = description!;
      this._isDisabledCash = isDisabledCash;
    }
  }

  public get httpMethod(): HttpMethod {
    return this._httpMethod;
  }

  public get path(): string {
    return this._path;
  }

  public get description(): string {
    return this._description;
  }

  public get isDisabledCash(): boolean {
    return this._isDisabledCash;
  }
}