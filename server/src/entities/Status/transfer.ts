import {Status} from '#entities/Status';
import {StatusData} from '#global';
import {Transfer} from '#includes/Transfer';

export const StatusTransfer = new Transfer<Status, StatusData>({
  Model: Status,
  modelById: id => Status.findByPk(id),
  modelsByIds: ids => Status.findAll({where: {id: ids}}),
  modelToData: ({id, name, color, order}) => ({id, name, color, order}),
});