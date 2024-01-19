import {RequestError} from '#errors';
import {Middleware} from '#middlewares';

export const authMiddleware: Middleware = (req, _res, next) =>
  next(req.jwt.user ? undefined : new RequestError.unauthorized('authMiddleware'));

export const emptyAuthMiddleware: Middleware = (req, _res, next) =>
  next(req.jwt.user ? new RequestError.badRequest('emptyAuthMiddleware', 'Вы уже авторизовались') : undefined);
