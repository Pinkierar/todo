import type {ListData, StatusData} from '../../';
import {HttpMethod} from '../../';
import {g_Route} from '../../utils';

export const g_StatusesRoute = {
  getStatuses: new g_Route<null, ListData<StatusData>>(
    HttpMethod.get,
    'statuses',
    'Получить все статусы',
  ),
  getStatus: new g_Route<{ id: number }, StatusData>(
    HttpMethod.get,
    'statuses/:id',
    'Получить статус',
  ),
} as const satisfies { [p: string]: g_Route<any, any, any, any> };
