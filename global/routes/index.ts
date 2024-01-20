import {g_PrioritiesRoute} from '../entities/Priority/routes';
import {g_StatusesRoute} from '../entities/Status/routes';
import {g_TasksRoute} from '../entities/Task/routes';
import {g_UsersRoute} from '../entities/User/routes';
import type {g_Route} from '../utils';
import {g_AuthRoute} from './auth';
import {g_RootRoute} from './root';

export const g_ApiRoute = {
  ...g_AuthRoute,
  ...g_RootRoute,
  ...g_PrioritiesRoute,
  ...g_UsersRoute,
  ...g_StatusesRoute,
  ...g_TasksRoute,
} as const satisfies { [p: string]: g_Route<any, any, any, any> };