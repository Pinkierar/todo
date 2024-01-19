import {UserArgs, UserArgsWithPassword, UserData} from '#global';
import {BaseModel} from '#includes/BaseModel';
import {sequelize} from '#includes/sequelize';
import {SetModelParameter} from '#includes/SetModelParameter';
import bcrypt from 'bcrypt';
import {CreationOptional, DataTypes, Op} from 'sequelize';

export class User extends BaseModel<User> {
  declare id: CreationOptional<UserData['id']>;
  declare name: UserData['name'];
  declare email: UserData['email'];
  declare password: UserArgs['password'];
  declare confirmed: CreationOptional<UserData['confirmed']>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  public static override readonly ru = 'Пользователь';

  public static initialize() {
    User.init({
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.TEXT('tiny'),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.TEXT('medium'),
        allowNull: false,
      },
      confirmed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    }, {
      sequelize,
    });
  }

  public static async fill() {
    const user: UserArgsWithPassword = {
      name: 'Pinkierar',
      email: 'admin@pinkierar.ru',
      password: await bcrypt.hash('qwerty123', 3),
      confirmed: true,
    };

    const where: SetModelParameter<User>['where'] = {
      [Op.or]: {
        email: user.email,
      },
    };
    const defaults: SetModelParameter<User>['defaults'] = {
      name: user.name,
      email: user.email,
      password: user.password,
      confirmed: user.confirmed,
    };

    await User.set({where, defaults});
  }

  private static async set(parameter: SetModelParameter<User>) {
    const [model, isNew] = await User.findOrCreate(parameter);

    !isNew && await model.update(parameter.defaults);
  }
}