import {User} from '#entities/User';
import {ModelError} from '#errors';
import {UserData, UserJwtData} from '#global';

export const UserJwtTransfer = {
  get: async (target: User | UserData | User['id']): Promise<UserJwtData> => {
    if (!(target instanceof User) && typeof target !== 'number') return {
      id: target.id,
    };

    const user = target instanceof User ? target : await User.findByPk(target, {
      rejectOnEmpty: new ModelError.notFound(
        `UserJwtTransfer.${UserJwtTransfer.get.name}`,
        User.ru,
        target as User['id'],
      ),
    });

    return {
      id: user.id,
    };
  },
};