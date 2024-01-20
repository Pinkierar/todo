import type {ListData, StatusArgs, StatusData} from '../../';
import {HttpMethod} from '../../';
import {g_Route} from '../../utils';

export const g_StatusesRoute = {
  createStatus: new g_Route<null, StatusData, StatusArgs>(
    HttpMethod.post,
    'statuses',
    'Добавить статус',
  ),
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
  editStatus: new g_Route<{ id: number }, StatusData, Partial<StatusArgs>>(
    HttpMethod.put,
    'statuses/:id',
    'Изменить статус',
  ),
  deleteStatus: new g_Route<{ id: number }>(
    HttpMethod.delete,
    'statuses/:id',
    'Удалить статус',
  ),
} as const satisfies { [p: string]: g_Route<any, any, any, any> };
