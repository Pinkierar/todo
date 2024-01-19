import {HttpMethod, UserArgs, UserData} from '../../';
import {g_Route} from '../../utils';

export const g_UsersRoute = {
  signUp: new g_Route<null, UserData, UserArgs>(
    HttpMethod.post,
    'users/register',
    'Зарегистрироваться',
  ),
} as const satisfies { [p: string]: g_Route<any, any, any, any> };
