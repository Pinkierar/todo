import {UserArgs} from '../';

export type LoginArgs = Readonly<
  Pick<UserArgs, 'email' | 'password'>
>;

export type ChangePasswordArgs = Readonly<{
  oldPassword: LoginArgs['password'],
  newPassword: LoginArgs['password'],
}>;