import {Task} from '#entities/Task';
import {User} from '#entities/User';
import {PriorityId, StatusData, statuses} from '#global';
import {Async} from '#includes/async';
import {BaseModel} from '#includes/BaseModel';
import {sequelize} from '#includes/sequelize';
import {SetModelParameter} from '#includes/SetModelParameter';
import {
  BelongsToCreateAssociationMixin,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  CreationOptional,
  DataTypes,
  ForeignKey,
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
  Op,
} from 'sequelize';

export class Status extends BaseModel<Status> {
  declare id: CreationOptional<StatusData['id']>;
  declare name: StatusData['name'];
  declare color: StatusData['color'];
  declare order: StatusData['order'];
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
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    }, {
      sequelize,
    });
  }

  public static async fill() {
    type SetStatusParameter = SetModelParameter<Status>;

    await Async.forEach(
      (Object.keys(statuses) as unknown as PriorityId[]),
      async key => {
        const where: SetStatusParameter['where'] = {
          [Op.or]: {
            id: statuses[key].id,
            name: statuses[key].name,
          },
        };
        const defaults: SetStatusParameter['defaults'] = {
          id: statuses[key].id,
          name: statuses[key].name,
          color: statuses[key].color,
          order: statuses[key].order,
        };

        await Status.set({where, defaults});
      },
    );
  }

  // private:

  private static async set(parameter: SetModelParameter<Status>) {
    const [model, isNew] = await Status.findOrCreate(parameter);

    !isNew && await model.update(parameter.defaults);
  }
}