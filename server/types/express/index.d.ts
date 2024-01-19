import {Jwt} from '#middlewares';
import {Cookies} from '#includes/ApiRoute';
import {Cache} from '#services';
import {BadCode, GoodCode, SureObject, UserData} from '#includes/global';

declare global {
  namespace Express {
    interface Request {
      isApiRoute?: boolean,
      shouldHashing?: boolean,
      jwt: Jwt;
      cacheNames: Cache['name'][];
      init_headers_json: string;
      init_cookies: any;
      init_authorization: string | undefined;
    }

    interface Response {
      handled: boolean,
      code: BadCode | GoodCode,
      data: SureObject & {
        user?: UserData,
        access?: string,
        whiteList?: string,
      };
      file?: string;
      cookies: Cookies;
      performanceTime: number;
    }
  }
}