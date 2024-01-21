import {User} from '#entities/User';
import {UserData} from '#global';
import {Transfer} from '#includes/Transfer';

export const UserTransfer = new Transfer<User, UserData>({
  Model: User,
  modelById: id => User.findByPk(id),
  modelsByIds: ids => User.findAll({where: {id: ids}}),
  modelToData: ({id, name, email, confirmed}) => ({id, name, email, confirmed}),
});