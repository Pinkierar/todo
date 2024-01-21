import {Task} from '#entities/Task';
import {TaskData} from '#global';
import {Transfer} from '#includes/Transfer';

export const TaskTransfer = new Transfer<Task, TaskData>({
  Model: Task,
  modelById: id => Task.findByPk(id),
  modelsByIds: ids => Task.findAll({where: {id: ids}}),
  modelToData: ({
    id,
    name,
    order,
    description,
    StatusId,
    PriorityId,
  }) => ({
    id,
    name,
    order,
    description,
    StatusId,
    PriorityId,
  }),
});