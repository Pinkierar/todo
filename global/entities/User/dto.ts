import {BaseData} from '../../';

export type UserData = BaseData<{
  id: number,
  name: string,
  email: string,
  confirmed: boolean,
}>;

export type UserArgsWithPassword = Readonly<
  Omit<UserData, 'id'>
  & { password: string }
>

export type UserArgs = Readonly<
  Pick<UserArgsWithPassword, 'name' | 'email' | 'password'>
>;