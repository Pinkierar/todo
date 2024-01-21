import {g_PrioritiesRoute} from '../entities/Priority/routes';
import {g_StatusesRoute} from '../entities/Status/routes';
import {g_TasksRoute} from '../entities/Task/routes';
import {g_UsersRoute} from '../entities/User/routes';
import type {g_Route} from '../utils';
import {g_AccountRoute} from './account';
import {g_AuthRoute} from './auth';

export const g_ApiRoute = {
  ...g_AccountRoute,
  ...g_AuthRoute,
  ...g_PrioritiesRoute,
  ...g_UsersRoute,
  ...g_StatusesRoute,
  ...g_TasksRoute,
} as const satisfies { [p: string]: g_Route<any, any, any, any> };