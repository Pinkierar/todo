import {BaseError} from '#errors';
import {BadCode, FailData} from '#global';
import {ForeignKeyConstraintError, UniqueConstraintError} from 'sequelize';
import {combinedMiddleware, ErrorMiddleware} from '#middlewares';

export const errorMiddleware: ErrorMiddleware<Promise<void>> = async (err, req, res, next) => {
  if (err instanceof ForeignKeyConstraintError) {
    res.code = BadCode.badRequest;
    res.data = {message: err.message, errors: [err.table]} as FailData;
  } else if (err instanceof UniqueConstraintError) {
    res.code = BadCode.badRequest;
    res.data = {message: err.message, errors: err.errors.map(error => error.message)} as FailData;
  } else if (err instanceof BaseError) {
    res.code = err.code;
    res.data = {message: err.message, errors: err.errors} as FailData;
    err.code === BadCode.unauthorized && res.cookies.remove.push(['refresh']);
  } else if (err instanceof Error) {
    res.code = BadCode.internal;
    res.data = {message: err.message, errors: []} as FailData;
  } else if (typeof err === 'string') {
    res.code = BadCode.internal;
    res.data = {message: err, errors: []} as FailData;
  } else {
    res.code = BadCode.internal;
    res.data = {message: 'other error', errors: []} as FailData;
  }

  if (res.code === BadCode.internal) console.log(err);

  await combinedMiddleware(req, res, next);
};