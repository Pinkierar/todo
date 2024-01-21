import {Task} from '#entities/Task';
import {priorities, PriorityData, PriorityId} from '#global';
import {Async} from '#includes/async';
import {BaseModel} from '#includes/BaseModel';
import {sequelize} from '#includes/sequelize';
import {SetModelParameter} from '#includes/SetModelParameter';
import {
  CreationOptional,
  DataTypes,
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

export class Priority extends BaseModel<Priority> {
  declare id: CreationOptional<PriorityData['id']>;
  declare name: PriorityData['name'];
  declare color: PriorityData['color'];

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

  public static override ru = 'Приоритет';

  public static initialize() {
    Priority.init({
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
    }, {
      sequelize,
    });
  }

  public static async fill() {
    type SetPriorityParameter = SetModelParameter<Priority>;

    await Async.forEach(
      (Object.keys(priorities) as unknown as PriorityId[]),
      async key => {
        const where: SetPriorityParameter['where'] = {
          [Op.or]: {
            id: priorities[key].id,
            name: priorities[key].name,
          },
        };
        const defaults: SetPriorityParameter['defaults'] = {
          id: priorities[key].id,
          name: priorities[key].name,
          color: priorities[key].color,
        };

        await Priority.set({where, defaults});
      },
    );
  }

  // private:

  private static async set(parameter: SetModelParameter<Priority>) {
    const [model, isNew] = await Priority.findOrCreate(parameter);

    !isNew && await model.update(parameter.defaults);
  }
}