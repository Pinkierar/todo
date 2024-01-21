import {ChangePasswordArgs, HttpMethod, UserArgs, UserData} from '../';
import {g_Route} from '../utils';

export const g_AccountRoute = {
  signUp: new g_Route<null, UserData, UserArgs>(
    HttpMethod.post,
    'account/register',
    'Зарегистрироваться',
  ),
  changePassword: new g_Route<null, {}, ChangePasswordArgs>(
    HttpMethod.put,
    'account/change-password',
    'Изменить пароль',
  ),
} as const satisfies { [p: string]: g_Route<any, any, any> };