import {Priority} from '#entities/Priority';
import {PriorityData} from '#global';
import {Transfer} from '#includes/Transfer';

export const PriorityTransfer = new Transfer<Priority, PriorityData>({
  Model: Priority,
  modelById: id => Priority.findByPk(id),
  modelsByIds: ids => Priority.findAll({where: {id: ids}}),
  modelToData: ({id, name, color}) => ({id, name, color}),
});