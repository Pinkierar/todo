import {Task} from '#entities/Task';
import {User} from '#entities/User';
import {StatusData} from '#global';
import {BaseModel} from '#includes/BaseModel';
import {sequelize} from '#includes/sequelize';
import {
  BelongsToCreateAssociationMixin,
  BelongsToGetAssociationMixin, BelongsToSetAssociationMixin,
  CreationOptional,
  DataTypes, ForeignKey,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManySetAssociationsMixin,
  NonAttribute,
} from 'sequelize';

export class Status extends BaseModel<Status> {
  declare id: CreationOptional<StatusData['id']>;
  declare name: StatusData['name'];
  declare color: StatusData['color'];
  declare order: StatusData['order'];
  declare UserId: ForeignKey<User['id']>;// region
  declare User?: NonAttribute<User>;
  declare createUser: BelongsToCreateAssociationMixin<User>;
  declare setUser: BelongsToSetAssociationMixin<User, User['id']>;
  declare getUser: BelongsToGetAssociationMixin<User>;// endregion
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

  public static override ru = 'Статус';

  public static initialize() {
    Status.init({
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
      color: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      order: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      UserId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {model: User},
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    }, {
      sequelize,
    });
  }
}