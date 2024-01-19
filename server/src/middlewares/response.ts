import {config} from '#config';
import {RequestError} from '#errors';
import {getHash} from '#includes/getHash';
import {UserTransfer} from '#entities/User';
import {GoodCode} from '#global';
import {Middleware} from '#middlewares';

export const responseMiddleware: Middleware = async (req, res, next) => {
  try {
    if (!res.handled) return next(new RequestError.requestDoesNotExist('responseMiddleware'));

    res.code = GoodCode.success;
    res.data = res.data ?? {};

    if (req.method === 'GET' && req.shouldHashing) {
      delete res.data.access;
      delete res.data.user;
      delete res.data.whiteList;

      const hash = String(getHash(JSON.stringify(res.data)));

      res.data = req.get('Response-Hash') === hash ? {hash} : {...res.data, hash};
    }

    await req.jwt.response(
      async (tokens, user) => {
        res.cookies.add.push([
          'refresh',
          tokens.refresh,
          {
            maxAge: config.jwt.refresh.expires * 1000,
            httpOnly: true,
          },
        ]);

        res.data.access = tokens.access;
        res.data.user = await UserTransfer.get(user.id);
        res.data.whiteList = (globalThis as any).whiteList;
      },
      async () => {
        res.cookies.remove.push(['refresh']);

        delete res.data.access;
        delete res.data.user;
      },
    );

    next();
  } catch (e) {
    next(e);
  }
};
