import {Performance} from '#includes/performance';
import {Middleware} from '#middlewares';

const startMiddleware: Middleware<void> = (_req, _res, next) => {
  Performance.start('request');

  next();
};
const finishMiddleware: Middleware<void> = (_req, res) => {
  res.performanceTime = Performance.finish('request');
};

export const performance = {
  startMiddleware,
  finishMiddleware,
};