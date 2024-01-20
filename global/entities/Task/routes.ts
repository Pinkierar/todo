import type {ListData, TaskArgs, TaskData} from '../../';
import {HttpMethod} from '../../';
import {g_Route} from '../../utils';

export const g_TasksRoute = {
  createTask: new g_Route<null, TaskData, TaskArgs>(
    HttpMethod.post,
    'tasks',
    'Добавить задачу пользователю',
  ),
  getTasks: new g_Route<null, ListData<TaskData>>(
    HttpMethod.get,
    'tasks',
    'Получить все задачи пользователя',
  ),
  getTask: new g_Route<{ id: number }, TaskData>(
    HttpMethod.get,
    'tasks/:id',
    'Получить задачу пользователя',
  ),
  editTask: new g_Route<{ id: number }, TaskData, Partial<TaskArgs>>(
    HttpMethod.put,
    'tasks/:id',
    'Изменить задачу пользователя',
  ),
  deleteTask: new g_Route<{ id: number }>(
    HttpMethod.delete,
    'tasks/:id',
    'Удалить задачу пользователя',
  ),
} as const satisfies { [p: string]: g_Route<any, any, any, any> };
