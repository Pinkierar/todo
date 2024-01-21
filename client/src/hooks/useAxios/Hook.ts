import {BadCode, ParsedQs, Status, SureObject} from '#global';
import {Route} from '#includes/ApiRoute';
import {axios, Fail, Response, Success} from '#includes/axios';
import {CancelTokenSource} from 'axios';
import {Dispatch, SetStateAction} from 'react';
import {
  useCacheEffect,
  useCacheMemo,
  useFailEffect,
  useIsLoading,
  useSuccessEffect,
  useSuccessMemo,
} from './Checker';

export class AxiosHook<
  P extends { [p: string]: string | number } | null = null,
  D extends SureObject = {},
  A = undefined,
  Q extends ParsedQs | undefined = undefined,
> {
  public constructor(
    route: Route<P, D, A, Q>,
    successState: UseStateReturnType<D | null>,
    failState: UseStateReturnType<Fail | null>,
    loadingState: UseStateReturnType<boolean>,
    cacheState: UseStateReturnType<D | undefined>,
  ) {
    [this.success, this.setSuccess] = successState;
    [this.fail, this.setFail] = failState;
    [this.isLoading, this.setLoading] = loadingState;
    [this.cache, this.setCache] = cacheState;

    this._route = route;
  }

  public request(
    this:
      Q extends undefined
        ? A extends undefined
          ? P extends null
            ? AxiosHook<P, D, A, Q>
            : never
          : never
        : never,
  ): Promise<Response<D>>;
  public request(
    this:
      Q extends undefined
        ? A extends undefined
          ? P extends null
            ? never
            : AxiosHook<P, D, A, Q>
          : never
        : never,
    params: P,
  ): Promise<Response<D>>;
  public request(
    this:
      Q extends undefined
        ? A extends undefined
          ? never
          : AxiosHook<P, D, A, Q>
        : never,
    params: P,
    args: A,
  ): Promise<Response<D>>;
  public request(
    this:
      Q extends undefined
        ? never
        : AxiosHook<P, D, A, Q>,
    params: P,
    args: A,
    query: Q,
  ): Promise<Response<D>>;
  public async request(params?: P, args?: A, query?: Q): Promise<Response<D>> {
    if (this.isLoading) this.cancel();

    const route = this._route as Route<any, D, any, any>;

    const cache = route.getCache(params);
    this.setCache(cache?.data);

    this.setSuccess(null);
    this.setFail(null);

    // TODO Что за setTimeout
    window.setTimeout(() => this.setLoading(true));

    this.cancelToken = axios.createCancelTokenSource();
    const response = await route.request(
      params ?? null,
      args,
      query,
      {cancelToken: this.cancelToken.token},
    );
    this.setLoading(false);

    this.cancelToken = undefined;

    if (response.status === Status.success && (response.data as any) === 'Cancel')
      return response;

    if (response instanceof Success) {
      this.setSuccess(response.data);
      this.setCache(response.data);
    } else {
      this.setFail(response);

      if (cache && (
        response.code === BadCode.unavailable ||
        response.code === BadCode.unauthorized
      )) {
        cache.remove();
        this.setCache(undefined);
      }
    }

    return response;
  }

  public sendFiles(
    this:
      A extends undefined
        ? Q extends undefined
          ? P extends null
            ? AxiosHook<P, D, A, Q>
            : never
          : never
        : never,
    files: FileList,
  ): Promise<Response<D>>;
  public sendFiles(
    this:
      A extends undefined
        ? Q extends undefined
          ? P extends null
            ? never
            : AxiosHook<P, D, A, Q>
          : never
        : never,
    files: FileList,
    params: P,
  ): Promise<Response<D>>;
  public sendFiles(
    this:
      A extends undefined
        ? Q extends undefined
          ? never
          : AxiosHook<P, D, A, Q>
        : never,
    files: FileList,
    params: P,
    query: Q,
  ): Promise<Response<D>>;
  public sendFiles(files: FileList, params?: P, query?: Q): Promise<Response<D>> {
    const t: AxiosHook<any, D, FileList, any> = this as any;
    return t.request(params, files, query);
  }

  public cancel(): void {
    this.cancelToken && this.cancelToken.cancel('Cancel');
  }

  public readonly cache: D | undefined;
  public readonly success: D | null;
  public readonly fail: Fail | null;
  public readonly isLoading: boolean;

  private readonly _route: Route<P, D, A, Q>;
  private cancelToken: CancelTokenSource | undefined;
  private readonly setCache: Dispatch<SetStateAction<D | undefined>>;
  private readonly setSuccess: Dispatch<SetStateAction<D | null>>;
  private readonly setFail: Dispatch<SetStateAction<Fail | null>>;
  private readonly setLoading: Dispatch<SetStateAction<boolean>>;

  public static useSuccessEffect = useSuccessEffect;
  public static useSuccessMemo = useSuccessMemo;
  public static useFailEffect = useFailEffect;
  public static useCacheEffect = useCacheEffect;
  public static useCacheMemo = useCacheMemo;
  public static useIsLoading = useIsLoading;
}