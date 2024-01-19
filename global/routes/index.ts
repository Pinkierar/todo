import {g_Route} from '../utils';
import {g_AuthRoute} from './auth';
import {g_RootRoute} from './root';
import {g_UsersRoute} from '../entities/User/routes';

export const g_ApiRoute = {
  ...g_AuthRoute,
  ...g_RootRoute,
  ...g_UsersRoute,
} as const satisfies { [p: string]: g_Route<any, any, any, any> };