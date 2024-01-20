import {Priority} from '#entities/Priority';
import {Status} from '#entities/Status';
import {User} from '#entities/User';
import {TaskData} from '#global';
import {BaseModel} from '#includes/BaseModel';
import {sequelize} from '#includes/sequelize';
import {
  BelongsToCreateAssociationMixin,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  CreationOptional,
  DataTypes,
  ForeignKey,
  NonAttribute,
} from 'sequelize';

export class Task extends BaseModel<Task> {
  declare id: CreationOptional<TaskData['id']>;
  declare name: TaskData['name'];
  declare description: TaskData['description'];
  declare order: TaskData['order'];
  declare PriorityId: ForeignKey<Priority['id']>;// region
  declare Priority?: NonAttribute<Priority>;
  declare createPriority: BelongsToCreateAssociationMixin<Priority>;
  declare setPriority: BelongsToSetAssociationMixin<Priority, Priority['id']>;
  declare getPriority: BelongsToGetAssociationMixin<Priority>;// endregion
  declare UserId: ForeignKey<User['id']>;// region
  declare User?: NonAttribute<User>;
  declare createUser: BelongsToCreateAssociationMixin<User>;
  declare setUser: BelongsToSetAssociationMixin<User, User['id']>;
  declare getUser: BelongsToGetAssociationMixin<User>;// endregion
  declare StatusId: ForeignKey<Status['id']>;// region
  declare Status?: NonAttribute<Status>;
  declare createStatus: BelongsToCreateAssociationMixin<Status>;
  declare setStatus: BelongsToSetAssociationMixin<Status, Status['id']>;
  declare getStatus: BelongsToGetAssociationMixin<Status>;// endregion
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  public static override ru = 'Задача';

  public static initialize() {
    Task.init({
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
      description: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
      },
      order: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      PriorityId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {model: Priority},
      },
      UserId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {model: User},
      },
      StatusId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {model: Status},
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    }, {
      sequelize,
    });
  }
}