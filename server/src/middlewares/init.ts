import {Middleware} from '#middlewares';

export const initMiddleware: Middleware = (req, res, next) => {
  try {
    req.cacheNames = [];

    res.handled = false;
    res.data = {};
    res.cookies = {
      add: [],
      remove: [],
    };
    res.performanceTime = Infinity;

    req.init_headers_json = JSON.stringify(req.headers);
    req.init_cookies = JSON.parse(JSON.stringify(req.cookies));
    req.init_authorization = req.headers.authorization;

    next();
  } catch (e) {
    next(e);
  }
};