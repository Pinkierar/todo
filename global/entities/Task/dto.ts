import {BaseData, PriorityId, StatusId} from '../../';

export type TaskData = BaseData<{
  id: number,
  name: string,
  description: string,
  order: number,
  PriorityId: PriorityId,
  StatusId: StatusId,
}>;

export type TaskArgs =
  Pick<TaskData, 'name'>
  & Partial<Pick<TaskData, 'description' | 'order' | 'PriorityId'>>;