import {NextFunction, Request, Response} from 'express';
import {performance} from './performance';
import {logMiddleware} from './log';
import {sendMiddleware} from './send';
import {ParamsDictionary} from 'express-serve-static-core';
import {ParsedQs} from 'qs';

export * from './auth';
export * from './error';
export * from './init';
export * from './Jwt';
export * from './log';
export * from './performance';
export * from './response';
export * from './send';
export * from './unknownError';

export type Middleware<
  R = any,
  P = ParamsDictionary,
  D = any,
  A = any,
  Q = ParsedQs,
> = (req: Request<P, D, A, Q>, res: Response<D>, next: NextFunction) => R;
export type ErrorMiddleware<
  R = any,
  P = ParamsDictionary,
  D = any,
  A = any,
  Q = ParsedQs,
> = (error: any, req: Request<P, D, A, Q>, res: Response<D>, next: NextFunction) => R;

export const combinedMiddleware: Middleware<Promise<void>> = async (req, res, next) => {
  performance.finishMiddleware(req, res, next);

  try {
    logMiddleware(req, res, next);
    sendMiddleware(req, res, next);
  } catch (e) {
    next(e);
  }
};