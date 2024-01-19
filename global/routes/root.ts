import {ChangePasswordArgs, HttpMethod} from '../';
import {g_Route} from '../utils';

export const g_RootRoute = {
  changePassword: new g_Route<null, {}, ChangePasswordArgs>(
    HttpMethod.put,
    'change-password',
    'Изменить пароль',
  ),
} as const satisfies { [p: string]: g_Route<any, any, any> };