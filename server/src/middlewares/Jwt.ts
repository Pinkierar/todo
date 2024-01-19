import {FileSystemService, TokenService} from '#services';
import {config} from '#config';
import {DateTimeFormat, Tokens, UserData, UserJwtData} from '#global';
import {Request} from 'express';
import {User, UserJwtTransfer} from '#entities/User';
import {Middleware} from './index';
import {RequestError} from '#errors';
import path from 'path';

export enum JwtStatus {
  ignore,
  new,
  remove,
  update,
}

const update = Symbol('Jwt.update');

class Jwt {
  private readonly _req: Request;
  private _status: JwtStatus = JwtStatus.ignore;
  private _tokens?: Tokens;
  private _user?: UserJwtData;

  public constructor(req: Request) {
    this._req = req;

    this._status = JwtStatus.ignore;

    const refresh = req.cookies.refresh;
    const access = req.headers.authorization?.split(' ')[1];

    if (refresh) {
      const refreshData = TokenService.getRefreshData(refresh);

      if (refreshData && refreshData.payloadData.iat) {
        if (refreshData.payloadData.dec - refreshData.payloadData.iat > config.jwt.refresh.update) {
          this.new(refreshData.userJwtData);
        } else {
          if (access) {
            const accessData = TokenService.getAccessData(access);

            if (accessData) {
              this._user = accessData.userJwtData;
            } else {
              this.new(refreshData.userJwtData, refresh);
            }
          } else {
            this.new(refreshData.userJwtData, refresh);
          }
        }
      } else {
        this.remove();
      }
    } else {
      this.remove();
    }
  }

  public get user(): UserJwtData | undefined {
    return this._user;
  }

  public async response(
    addCallback: (tokens: Tokens, user: UserJwtData) => Promise<void>,
    removeCallback: () => Promise<void>,
  ): Promise<void> {
    if (this._status === JwtStatus.new) {
      if (!this._tokens) throw new Error('Jwt.response: !this._tokens');
      if (!this._user) throw new Error('Jwt.response: !this._user');
      await addCallback(this._tokens, this._user);
    } else if (this._status === JwtStatus.remove) {
      await removeCallback();
    }
  }

  public remove(): void {
    this._status = JwtStatus.remove;
    this._tokens = undefined;
    this._user = undefined;

    delete this._req.cookies.refresh;
    delete this._req.headers.authorization;
  }

  public new(userJwtData: UserJwtData, refresh?: Tokens['refresh'], access?: Tokens['access']): void {
    this._status = JwtStatus.new;
    this._user = userJwtData;

    refresh = refresh ?? TokenService.newRefresh(userJwtData);
    access = access ?? TokenService.newAccess(userJwtData);

    this._tokens = {refresh, access};

    this._req.cookies.refresh = refresh;
    this._req.headers.authorization = `Bearer ${access}`;
  }

  //

  /**private*/ async [update](target?: User | UserData | User['id'] | UserJwtData): Promise<void> {
    if (!this._user) throw new Error('Jwt.update: !this._user');

    // Если target не является UserJwtData
    if (target === undefined || 'email' in target || typeof target === 'number') {
      target = await UserJwtTransfer.get(target ?? this._user.id);
    }

    this.new(target);
  }
}

export const jwtMiddleware: Middleware<Promise<void>> = async (req, _res, next) => {
  try {
    req.jwt = new Jwt(req);

    const userJwt = req.jwt.user;

    if (userJwt) {
      const realJwt = await UserJwtTransfer.get(userJwt.id).catch(() => undefined);

      // Авторизованный пользователь не найден в базе
      if (!realJwt) {
        req.jwt.remove();

        return next(new RequestError.unauthorized('jwtMiddleware'));
      }

      // Данные токена авторизованного пользователя не совпадают с данными в базе данных
      const userJwtString = JSON.stringify(userJwt);
      const realJwtString = JSON.stringify(realJwt);
      if (userJwtString !== realJwtString) {
        await req.jwt[update](realJwt);

        const date = new Date();
        const fileName = `${DateTimeFormat.toDateFileName(date)}.txt`;
        const rowName = DateTimeFormat.toTime(date);
        await FileSystemService.addInFile(
          path.join(config.io.jwtUpdates, fileName),
          `${rowName}\t${userJwtString}\t->\t${realJwtString}`,
        );
      }
    }

    next();
  } catch (e) {
    next(e);
  }
};

export type {
  Jwt,
};