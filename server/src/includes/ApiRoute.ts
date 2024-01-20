import {g_ApiRoute, g_Route, httpMethodToMethod, ListData, Method, SureObject} from '#global';
import {CookieOptions, Request, Router} from 'express';
import {RequestHandler} from 'express-serve-static-core';
import {Middleware} from '#middlewares';
import {validationResult} from 'express-validator';
import {RequestError} from '#errors';
import {clear, colored, ConsoleStyle, formatData} from '#includes/console';
import {ParsedQs} from 'qs';

export type Cookies = {
  add: [name: string, value: string, options: CookieOptions][],
  remove: [name: string, options?: CookieOptions][],
};

type RequestData<D extends SureObject> = {
  data: D,
  file?: never,
  cookies?: Partial<Cookies>,
} | {
  data?: never,
  file: string,
  cookies?: Partial<Cookies>,
};

export type ControllerFunc<
  P extends { [p: string]: string } | null = null,
  D extends SureObject = SureObject,
  A = undefined,
  Q extends ParsedQs | undefined = undefined,
  _L = D extends ListData ? D['list'][number] : never,
> = (
  req: Request<NonNullable<P>, D, A, Q>,
) => Promise<
  void
  | string
  | RequestData<D>
  | (D extends ListData ? Array<_L> : RequestData<D>)
>;

export interface Controller {
  getAll: ControllerFunc<{}, ListData>;
  get: ControllerFunc<any>;
}

export interface ControllerFull extends Controller {
  create: ControllerFunc<{}, SureObject, any>;
  edit: ControllerFunc<any, SureObject, any>;
  delete: ControllerFunc<any, {}>;
}

export const requestHandler = <
  P extends { [p: string]: string } | null,
  D extends SureObject,
  A,
  Q extends ParsedQs | undefined,
>(
  callback: ControllerFunc<P, D, A, Q>,
): Middleware<Promise<void>, NonNullable<P>, D, A, Q> => async (req, res, next) => {
  try {
    if (res.handled) return next();
    res.handled = true;

    const errors = validationResult(req);
    if (!errors.isEmpty())
      return next(new RequestError.badRequest(
        'requestHandler',
        'Неправильные данные запроса',
        errors.array(),
      ));

    let request: RequestData<any> | void | string | any[] = await callback(req);
    if (!request) request = {data: {}};
    if (Array.isArray(request)) request = {data: {list: request}};
    if (typeof request === 'string') request = {file: request};

    if (request.cookies) res.cookies = {add: [], remove: [], ...request.cookies};
    if (request.file) res.file = request.file;
    else res.data = request.data ?? {};

    next();
  } catch (e) {
    next(e);
  }
};

type RequestHandlers<P extends { [p: string]: string }, D extends SureObject, A, Q> =
  Array<RequestHandlers<P, D, A, Q>> | RequestHandler<P, D, A, Q>;

export class Route<
  P extends { [p: string]: string } | null = null,
  D extends SureObject = SureObject,
  A = undefined,
  Q extends ParsedQs | undefined = undefined,
> extends g_Route<P, D, A, Q> {
  public constructor(routeRef: g_Route<P, D, A, Q>) {
    super(routeRef);
  }

  public addRoute(
    inRouter: Router,
    middlewares: Array<RequestHandlers<P extends null ? { [p: string]: string } : P, D, A, any>>,
    callback: ControllerFunc<P extends null ? { [p: string]: string } : P, D, A, Q>,
  ) {
    inRouter[httpMethodToMethod(this.httpMethod)](
      `/${this.path}`,
      this.disableHashing(),
      middlewares.flat(20) as Array<RequestHandler<P, D, A>>,
      requestHandler(callback) as Middleware<Promise<void>, P, D, A, Q>,
    );
  }

  public static add<P extends { [p: string]: string }, D extends SureObject, A, Q>(
    inRouter: Router,
    method: Method | 'all',
    path: string,
    middlewares: Array<RequestHandlers<P, D, A, Q>>,
    callback: ControllerFunc,
  ): void {
    inRouter[method](
      path,
      middlewares.flat(20) as Array<RequestHandler>,
      requestHandler(callback),
    );
  }

  private disableHashing(): RequestHandler<P, D, A, Q> {
    return (req, _res, next) => {
      req.shouldHashing = !this.isDisabledCash;

      next();
    };
  }
}

export function createController<
  P extends { [p: string]: string } | null,
  D extends SureObject,
  A,
  Q extends ParsedQs | undefined
>(
  route: Route<P, D, A, Q>,
  callback?: ControllerFunc<P, D, A, Q>,
): ControllerFunc<P, D, A, Q> {
  return callback ?? (async () => undefined);
}

export const ApiRoute: {
  readonly [key in keyof typeof g_ApiRoute]: Route<
    { [key_ in keyof typeof g_ApiRoute[key]['_typeP']]: string },
    typeof g_ApiRoute[key]['_typeD'],
    typeof g_ApiRoute[key]['_typeA'],
    typeof g_ApiRoute[key]['_typeQ'] extends undefined
      ? undefined
      : (Omit<typeof g_ApiRoute[key]['_typeQ'], 'ids'> & { ids?: string[] })
  >
} = Object.keys(g_ApiRoute).reduce((out, key) => {
  out[key] = new Route((g_ApiRoute as any)[key]);
  return out;
}, {} as any);

export const logApiRoutes = () => {
  const routes = ApiRoute as any as { [p: string]: Route };

  clear(2);
  console.log(
    colored(
      'Роуты:',
      [255, 255, 255],
      [ConsoleStyle.Bold],
    ),
    formatData(
      Object.keys(routes)
        .sort((a, b) => {
          const aChar = routes[a].path[0];
          const bChar = routes[b].path[0];

          return aChar < bChar ? -1 : aChar > bChar ? 1 : 0;
        })
        .reduce((out, key) => {
          const route = routes[key];

          out[key] = route.description;

          return out;
        }, {} as { [p: string]: string }),
    ),
  );
};