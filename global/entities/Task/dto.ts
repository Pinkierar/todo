import type {BaseData, PriorityId} from '../../';

export type TaskData = BaseData<{
  id: number,
  name: string,
  description: string,
  order: number,
  PriorityId?: PriorityId,
}>;

export type TaskArgs =
  Pick<TaskData, 'name'>
  & Partial<Pick<TaskData, 'description' | 'order' | 'PriorityId'>>;

export type TaskEditionArgs =
  Partial<TaskArgs>
  & Pick<TaskData, 'id'>;