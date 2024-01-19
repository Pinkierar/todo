export type Method =
  | 'get'
  | 'post'
  | 'put'
  | 'delete';

export enum HttpMethod {
  get,
  post,
  put,
  delete,
}

export const methodToHttpMethod = (method: Method): HttpMethod => {
  switch (method) {
    case 'post':
      return HttpMethod.post;
    case 'get':
      return HttpMethod.get;
    case 'put':
      return HttpMethod.put;
    case 'delete':
      return HttpMethod.delete;
    default:
      throw new Error('methodToHttpMethod: unknown method');
  }
};

export const httpMethodToMethod = (httpMethod: HttpMethod): Method => {
  switch (httpMethod) {
    case HttpMethod.post:
      return 'post';
    case HttpMethod.put:
      return 'put';
    case HttpMethod.get:
      return 'get';
    case HttpMethod.delete:
      return 'delete';
    default:
      throw new Error('httpMethodToMethod: unknown httpMethod');
  }
};

export enum BadCode {
  error = 0,
  badRequest = 400,
  unauthorized = 401,
  unavailable = 403,
  notFound = 404,
  payloadTooLarge = 413,
  internal = 500,
  falsy = 412,
}

export enum GoodCode {
  success = 200,
}

export enum Status {
  success,
  fail,
}

export type ListData<T = any> = {
  list: T[],
};

export type FailData = {
  message: string,
  errors: any[],
};

export type SureObject<T = { [p: string]: unknown }> = T & { '-'?: void };