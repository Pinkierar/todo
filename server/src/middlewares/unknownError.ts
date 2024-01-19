import {BadCode} from '#global';
import {ErrorMiddleware} from '#middlewares';

export const unknownErrorMiddleware: ErrorMiddleware = (err, _req, res) => {
  console.log(err);
  res.status(BadCode.internal).json({message: 'Необработанная ошибка', errors: []});
};