import {g_ApiRoute, g_Route, ParsedQs, SureObject} from '#global';
import {axios, RequestConfig, Response} from '#includes/axios';
import {SuccessData} from '#includes/axios/Success';
import {Cache} from '#includes/axios/Cache';
import {RouteBase} from '#includes/RouteBase';

export class Route<
  P extends { [p: string]: string | number } | null, // TODO поменять null на undefined
  D extends SureObject,
  A = undefined,
  Q extends ParsedQs | undefined = undefined,
> extends g_Route<P, D, A, Q> {
  public constructor(routeRef: g_Route<P, D, A, Q>) {
    super(routeRef);
  }

  public getCache(): P extends null ? (Cache<SuccessData<D>> | undefined) : never;
  public getCache(params: P): P extends null ? never : (Cache<SuccessData<D>> | undefined);
  public getCache(params?: P): Cache<SuccessData<D>> | undefined {
    return axios.getCache<D>(this.httpMethod, (this.createUrl as any)(params));
  }

  public request(
    this:
      Q extends undefined
        ? A extends undefined
          ? P extends null
            ? Route<P, D, A, Q>
            : never
          : never
        : never
  ): Promise<Response<D>>;
  public request(
    this:
      Q extends undefined
        ? A extends undefined
          ? P extends null
            ? never
            : Route<P, D, A, Q>
          : never
        : never,
    params: P,
  ): Promise<Response<D>>;
  public request(
    this:
      Q extends undefined
        ? A extends undefined
          ? never
          : Route<P, D, A, Q>
        : never,
    params: P,
    args: A,
  ): Promise<Response<D>>;
  public request(
    this:
      Q extends undefined
        ? never
        : Route<P, D, A, Q>,
    params: P,
    args: A,
    query: Q,
  ): Promise<Response<D>>;
  public request(
    this: Route<P, D, A, Q>,
    params: P,
    args: A,
    query: Q,
    config: RequestConfig,
  ): Promise<Response<D>>;
  public async request(
    params?: P,
    args?: A,
    query?: Q,
    config?: RequestConfig,
  ): Promise<Response<D>> {
    return await axios.request<D, A, Q>(
      this.httpMethod,
      (this.createUrl as any)(params),
      args,
      query,
      {...config, isDisabledCash: this.isDisabledCash},
    );
  }

  public createUrl(
    this: P extends null ? Route<P, D, A, Q> : never,
  ): string
  public createUrl(
    this: P extends null ? never : Route<P, D, A, Q>,
    params: P,
  ): string
  public createUrl(
    params?: P,
  ): string {
    return `api/${RouteBase.createUrl(this.path, params ?? undefined)}`;
  }
}

export const ApiRoute: {
  readonly [key in keyof typeof g_ApiRoute]: Route<
    typeof g_ApiRoute[key]['_typeP'],
    typeof g_ApiRoute[key]['_typeD'],
    typeof g_ApiRoute[key]['_typeA'],
    typeof g_ApiRoute[key]['_typeQ']
  >
} = Object.keys(g_ApiRoute).reduce((out, key) => {
  out[key] = new Route((g_ApiRoute as any)[key]);
  return out;
}, {} as any);