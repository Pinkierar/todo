import {CacheService} from '#services';
import {Async} from '#includes/async';
import {Middleware} from '#middlewares';

export const cacheUpdater: Middleware = async (req, _res, next) => {
  try {
    await Async.forEach(req.cacheNames, name => CacheService.update(name));

    next();
  } catch (e) {
    next(e);
  }
};