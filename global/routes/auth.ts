import {HttpMethod, JwtData, LoginArgs, UserArgs, UserData} from '../';
import {g_Route} from '../utils';

export const g_AuthRoute = {
  signIn: new g_Route<null, JwtData, LoginArgs>(
    HttpMethod.post,
    'auth',
    'Вход',
  ),
  getToken: new g_Route<null, JwtData | {}>(
    HttpMethod.get,
    'auth',
    'Получение токена',
    true,
  ),
  signOut: new g_Route(
    HttpMethod.delete,
    'auth',
    'Выход',
  ),
} as const satisfies { [p: string]: g_Route<any, any, any> };