import jvt from 'jsonwebtoken';
import {config} from '#config';
import {Tokens, UserJwtData} from '#global';

type TokenData = {
  readonly userJwtData: UserJwtData,
  readonly payloadData: PayloadData
};

type PayloadData = {
  iss?: string,
  sub?: string,
  aud?: string | string[],
  exp?: number,
  nbf?: number,
  iat?: number,
  jti?: string,
  dec: number
};

class Service {
  public newAccess(userJwtData: UserJwtData): Tokens['access']
  public newAccess(userJwtData: UserJwtData): Tokens['access'] {
    return jvt.sign(
      userJwtData,
      config.jwt.access.key,
      {expiresIn: `${config.jwt.access.expires}s`},
    );
  }

  public newRefresh(userJwtData: UserJwtData): Tokens['refresh']
  public newRefresh(userJwtData: UserJwtData): Tokens['refresh'] {
    return jvt.sign(
      userJwtData,
      config.jwt.refresh.key,
      {expiresIn: `${config.jwt.refresh.expires}s`},
    );
  }

  public newPair(userJwtData: UserJwtData): Tokens
  public newPair(userJwtData: UserJwtData): Tokens {
    return {
      access: this.newAccess(userJwtData),
      refresh: this.newRefresh(userJwtData),
    };
  }

  public getAccessData(access: Tokens['access']): TokenData | null
  public getAccessData(access: Tokens['access']): TokenData | null {
    try {
      const payload = jvt.verify(
        access,
        config.jwt.access.key,
      ) as UserJwtData & PayloadData;
      const {iss, sub, aud, exp, nbf, iat, jti, ...userDto} = payload;
      const dec = Math.floor(Date.now() / 1000);

      return {
        userJwtData: userDto,
        payloadData: {iss, sub, aud, exp, nbf, iat, jti, dec},
      };
    } catch (e) {
      return null;
    }
  }

  public getRefreshData(refresh: Tokens['refresh']): TokenData | null
  public getRefreshData(refresh: Tokens['refresh']): TokenData | null {
    try {
      const payload = jvt.verify(
        refresh,
        config.jwt.refresh.key,
      ) as UserJwtData & PayloadData;
      const {iss, sub, aud, exp, nbf, iat, jti, ...userDto} = payload;
      const dec = Math.floor(Date.now() / 1000);

      return {
        userJwtData: userDto,
        payloadData: {iss, sub, aud, exp, nbf, iat, jti, dec},
      };
    } catch (e) {
      return null;
    }
  }
}

export const TokenService = new Service();