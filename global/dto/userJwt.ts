import {UserData} from '../';

export type UserJwtData = Readonly<
  Pick<UserData, 'id'>
>;

export type Tokens = Readonly<{
  access: string,
  refresh: string,
}>;

export type TokensData = Readonly<{
  tokens: Tokens,
  user: UserData,
}>;

export type JwtData = Readonly<
  Pick<Tokens, 'access'>
  & Pick<TokensData, 'user'>
>;