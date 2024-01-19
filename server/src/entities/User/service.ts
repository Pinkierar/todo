import {User, UserTransfer} from '#entities/User';
import {ModelError} from '#errors';
import {UserArgs, UserData} from '#global';
import {sequelize} from '#includes/sequelize';
import bcrypt from 'bcrypt';
import {Transaction} from 'sequelize';

export const UserService = new (class UserService {
  public async create(args: UserArgs): Promise<UserData>
  public async create(
    args: UserArgs,
  ): Promise<UserData> {
    const newUser = await sequelize.transaction(
      async transaction => this.createWithTransaction(
        args,
        transaction,
      ),
    );

    return await UserTransfer.get(newUser.id);
  }

  // private:

  private async createWithTransaction(
    args: UserArgs,
    transaction: Transaction,
  ): Promise<User> {
    const {
      password,
      ...otherArgs
    } = args;

    const cryptoPassword = await bcrypt.hash(password, 3);

    const [user, created] = await User.findOrCreate({
      where: {email: otherArgs.email},
      defaults: {password: cryptoPassword, ...otherArgs},
      transaction,
    });

    if (!created) throw new ModelError.alreadyExists(
      `${this.constructor.name}.${this.createWithTransaction.name}`,
      User.ru,
      args.email,
    );

    return user;
  }
})();