import {urls} from '#config';
import {
  BadCode,
  FailData,
  GoodCode,
  HttpMethod,
  httpMethodToMethod,
  JwtData,
  ParsedQs,
  SureObject,
} from '#global';
import {requests, user} from '#store';
import libAxios, {AxiosInstance, AxiosRequestConfig, AxiosResponse, CancelTokenSource} from 'axios';
import {Cache} from './Cache';
import {Fail} from './Fail';
import {Logger} from './Logger';
import {Success, SuccessData} from './Success';

export type RequestConfig =
  Omit<AxiosRequestConfig, 'url' | 'method' | 'data' | 'headers' | 'isDisabledCash'>
  & { isDisabledCash?: boolean };

export type Response<D extends SureObject> = Success<D> | Fail;

class Axios {
  public constructor() {
    if (Axios.isCreated) throw new Error('Axios.new: already created');
    Axios.isCreated = true;

    this._instance = libAxios.create({
      baseURL: urls.backend,
      withCredentials: true,
      headers: {'Content-Type': 'application/json'},
    });
  }

  public getCache<D extends SureObject, S extends SuccessData<D> = SuccessData<D>>(
    httpMethod: HttpMethod,
    url: string,
  ): Cache<S> | undefined {
    const name = Cache.createName(httpMethod, url);

    const byMemory = this._caches[name];
    if (byMemory) return byMemory;

    const byLocalStorage = Cache.byLocalStorage<S>(name);
    if (!byLocalStorage) return undefined;

    this.addCache(byLocalStorage);

    return byLocalStorage;
  }

  public async request<
    D extends SureObject,
    A = undefined,
    Q extends ParsedQs | undefined = undefined,
    H extends HttpMethod = HttpMethod,
  >(
    httpMethod: H,
    url: string,
    args?: H extends HttpMethod.get ? undefined : A,
    query?: Q,
    config?: RequestConfig,
  ): Promise<Response<D>> {
    const data = httpMethod === HttpMethod.delete ? {data: args} : args;

    const requestId = requests.add(`${httpMethod} ${url}`);

    const logger = new Logger(httpMethod, this.getUri(url, query));

    user.authorized && logger.addArgsItem({content: 'Authorization in header', color: '#0A0'});
    args !== null && args !== undefined && logger.addArgsItem({content: args});

    if (query) {
      logger.addArgsItem({
        content: Object.keys(query).length === 1 && 'ids' in query
          ? query.ids
          : query,
      });
    }

    const cache = config?.isDisabledCash ? undefined : this.getCache<D>(httpMethod, url);
    cache && logger.addArgsItem({content: `Cache required ${cache.hash}`, color: '#08F'});

    let response = await this.createResponse<D>(
      httpMethod,
      url,
      data,
      query,
      cache?.hash,
      config,
    );

    if ((response as any).message === 'Cancel')
      return new Success(GoodCode.success, 'Cancel' as any);

    logger.addDataItem({content: `code: ${response.code}`});

    if (response instanceof Success) {
      if (httpMethod === HttpMethod.get) {
        if (response.data.hash) {
          if (cache) {
            if (response.data.hash === cache.hash) {
              logger.addDataItem({content: 'From cache', color: '#08F'});
              response = new Success<D>(response.code, cache.data);
            } else {
              cache.update(response.data);
            }
          } else {
            this.addCache(new Cache(httpMethod, url, response.data));
          }
        } else {
          cache?.remove();
        }
      }

      if (response.data.user && response.data.access) {
        const {access, user: userData} = response.data as JwtData;

        this.setAuthorization(access);
        user.setData(userData);
      }

      logger.addDataItem({content: response.data});
    } else {
      response.errors && logger.addDataItem({content: response.errors});

      if (response.code === BadCode.unauthorized) {
        this.removeAuthorization();
      }

      if (cache && (
        response.code === BadCode.unauthorized
        || response.code === BadCode.unavailable
      )) {
        delete this._caches[cache.name];
      }

      logger.addDataItem({content: response.message});
    }

    logger.run();

    requests.setStatus(requestId, response.status);

    return response;
  }

  public async post<
    D extends SureObject,
    A = undefined,
    Q extends ParsedQs | undefined = undefined,
  >(
    url: string,
    args?: A,
    query?: Q,
    config?: RequestConfig,
  ): Promise<Response<D>> {
    return this.request<D, A, Q>(HttpMethod.post, url, args, query, config);
  }

  public async put<
    D extends SureObject,
    A = undefined,
    Q extends ParsedQs | undefined = undefined,
  >(
    url: string,
    args?: A,
    query?: Q,
    config?: RequestConfig,
  ): Promise<Response<D>> {
    return this.request<D, A, Q>(HttpMethod.put, url, args, query, config);
  }

  public async get<
    D extends SureObject,
    A = undefined,
    Q extends ParsedQs | undefined = undefined,
  >(
    url: string,
    args?: A,
    query?: Q,
    config?: RequestConfig,
  ): Promise<Response<D>> {
    return this.request<D, A, Q>(HttpMethod.get, url, args, query, config);
  }

  public async delete<
    D extends SureObject,
    A = undefined,
    Q extends ParsedQs | undefined = undefined,
  >(
    url: string,
    args?: A,
    query?: Q,
    config?: RequestConfig,
  ): Promise<Response<D>> {
    return this.request<D, A, Q>(HttpMethod.delete, url, args, query, config);
  }

  public setAuthorization(access: JwtData['access']) {
    this._instance.defaults.headers.common['Authorization'] = `Bearer ${access}`;
  }

  public get authorization(): string | undefined {
    return this._instance.defaults.headers.common['Authorization'] as string | undefined;
  }

  public removeAuthorization() {
    delete this._instance.defaults.headers.common['Authorization'];
    user.clear();
  }

  public createCancelTokenSource(): CancelTokenSource {
    return libAxios.CancelToken.source();
  }

  //

  private getUri(url: string, query?: ParsedQs): string {
    return this._instance.getUri({url, params: query});
  }

  private addCache<D extends SureObject, S extends SuccessData<D> = SuccessData<D>>(cache: Cache<S>) {
    this._caches[cache.name] = cache;
  }

  private static convertResponse<D extends SureObject, S extends SuccessData<D> = SuccessData<D>>(
    response: ({ status: GoodCode } & AxiosResponse<S>)
      | ({ status: BadCode } & AxiosResponse<string | FailData>),
  ): Response<D> {
    if (response.status === GoodCode.success)
      return new Success(response.status, response.data);

    return typeof response.data === 'string'
      ? new Fail(response.status, response.data, [])
      : new Fail(response.status, response.data.message, response.data.errors);
  }

  private static createConfig<A = any>(
    args: A,
    hash?: string,
    config?: RequestConfig,
  ): Omit<AxiosRequestConfig<A | FormData>, 'url' | 'method'> {
    const {isDisabledCash, ...otherConfig} = config || {isDisabledCash: false};

    if (args instanceof FileList || args instanceof Blob) {
      const blobs: Blob[] = args instanceof FileList ? Array.from(args) : [args];
      const formData = new FormData();
      blobs.forEach((blob, index) => formData.append(`files[${index}]`, blob));

      return {...otherConfig, data: formData, headers: {'Content-Type': 'multipart/form-data'}};
    }

    const headers = isDisabledCash ? undefined : hash ? {'Response-Hash': hash} : undefined;

    return {...otherConfig, data: args, headers: headers};
  }

  private async createResponse<
    D extends SureObject,
    A = any,
    Q = any,
  >(
    httpMethod: HttpMethod,
    url: string,
    args: A,
    query: Q,
    hash?: string,
    config?: RequestConfig,
  ): Promise<Response<D>> {
    const method = httpMethodToMethod(httpMethod);

    try {
      let newConfig = Axios.createConfig(args, hash, config);

      const axiosConfig = {url, params: query, method, ...newConfig};
      const response = await this._instance.request(axiosConfig);

      return Axios.convertResponse(response);
    } catch (e) {
      const error = e as Error & { response?: AxiosResponse };

      if (error.response) return Axios.convertResponse(error.response);

      return new Fail(BadCode.error, error.message, []);
    }
  }

  private static isCreated: boolean = false;

  private readonly _instance: AxiosInstance;

  private readonly _caches: { [p: string]: Cache<any> } = {};
}

export const axios = new Axios();