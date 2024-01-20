import type {ListData, PriorityData} from '../../';
import {HttpMethod} from '../../';
import {g_Route} from '../../utils';

export const g_PrioritiesRoute = {
  getPriorities: new g_Route<null, ListData<PriorityData>>(
    HttpMethod.get,
    'priorities',
    'Получить все приоритеты',
  ),
  getPriority: new g_Route<{ id: number }, PriorityData>(
    HttpMethod.get,
    'priorities/:id',
    'Получить приоритет',
  ),
} as const satisfies { [p: string]: g_Route<any, any, any, any> };
