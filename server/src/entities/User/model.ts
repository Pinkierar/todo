import {Status} from '#entities/Status';
import {Task} from '#entities/Task';
import {UserArgs, UserData} from '#global';
import {BaseModel} from '#includes/BaseModel';
import {sequelize} from '#includes/sequelize';
import {
  CreationOptional,
  DataTypes, HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin, HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin, HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManySetAssociationsMixin,
  NonAttribute,
} from 'sequelize';

export class User extends BaseModel<User> {
  declare id: CreationOptional<UserData['id']>;
  declare name: UserData['name'];
  declare email: UserData['email'];
  declare password: UserArgs['password'];
  declare confirmed: CreationOptional<UserData['confirmed']>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare Tasks?: NonAttribute<Task[]>;// region
  declare addTasks: HasManyAddAssociationsMixin<Task, Task['id']>;
  declare setTasks: HasManySetAssociationsMixin<Task, Task['id']>;
  declare hasTasks: HasManyHasAssociationsMixin<Task, Task['id']>;
  declare getTasks: HasManyGetAssociationsMixin<Task>;
  declare removeTasks: HasManyRemoveAssociationsMixin<Task, Task['id']>;
  declare countTasks: HasManyCountAssociationsMixin;
  declare createTask: HasManyCreateAssociationMixin<Task, 'id'>;
  declare addTask: HasManyAddAssociationMixin<Task, Task['id']>;
  declare hasTask: HasManyHasAssociationMixin<Task, Task['id']>;
  declare removeTask: HasManyRemoveAssociationMixin<Task, Task['id']>;// endregion

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
}