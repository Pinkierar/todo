import {config, TaskArgs} from '#global';
import {ValidatorType} from '#includes/validator';

const {min, max} = config.lengths;

export const TaskValidator: ValidatorType<TaskArgs> = {
  name: key => key.isString(min.name, max.base),
  description: key => key.isString(min.name, max.medium).optional(),
  order: key => key.isInteger().optional(),
  PriorityId: key => key.isString(min.name, max.base).optional(),
};