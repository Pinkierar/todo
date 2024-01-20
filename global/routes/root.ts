import {ChangePasswordArgs, HttpMethod, UserArgs, UserData} from '../';
import {g_Route} from '../utils';

export const g_RootRoute = {
  signUp: new g_Route<null, UserData, UserArgs>(
    HttpMethod.post,
    'register',
    'Зарегистрироваться',
  ),
  changePassword: new g_Route<null, {}, ChangePasswordArgs>(
    HttpMethod.put,
    'change-password',
    'Изменить пароль',
  ),
} as const satisfies { [p: string]: g_Route<any, any, any> };