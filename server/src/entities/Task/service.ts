import {Task, TaskTransfer} from '#entities/Task';
import {ModelError} from '#errors';
import {PriorityId, StatusId, TaskArgs, TaskData, UserData} from '#global';
import {sequelize} from '#includes/sequelize';
import {Transaction} from 'sequelize';

type TaskCreationArgs = TaskArgs & { UserId: UserData['id'] };

export const TaskService = new (class TaskService {
  public async create(args: TaskCreationArgs): Promise<TaskData> {
    const newTask = await sequelize.transaction(
      async transaction => this.createWithTransaction(
        args,
        transaction,
      ),
    );

    return await TaskTransfer.get(newTask.id);
  }

  public async getAll(): Promise<TaskData[]> {
    const tasks = await Task.findAll();

    return await TaskTransfer.get(tasks);
  }

  public async get(id: TaskData['id']): Promise<TaskData> {
    return await TaskTransfer.get(id);
  }

  public async edit(id: TaskData['id'], args: Partial<TaskArgs>): Promise<TaskData> {
    await sequelize.transaction(
      transaction => this.editWithTransaction(
        id,
        args,
        transaction,
      ),
    );

    return await TaskTransfer.get(id);
  }

  public async delete(id: TaskData['id']): Promise<void> {
    await sequelize.transaction(
      transaction => this.deleteWithTransaction(
        id,
        transaction,
      ),
    );
  }

  // private:

  private async createWithTransaction(
    args: TaskCreationArgs,
    transaction: Transaction,
  ): Promise<Task> {
    return await Task.create({
      name: args.name,
      order: args.order ?? await Task.count({transaction}),
      description: args.description || '',
      PriorityId: args.PriorityId ?? PriorityId.normal,
      StatusId: StatusId.open,
      UserId: args.UserId,
    }, {
      transaction,
    });
  }

  private async editWithTransaction(
    id: TaskData['id'],
    args: Partial<TaskArgs>,
    transaction: Transaction,
  ): Promise<void> {
    const [updatedCount] = await Task.update(
      args,
      {where: {id}, limit: 1, transaction},
    );

    if (updatedCount === 0) throw new ModelError.notFound(
      `${this.constructor.name}.${this.editWithTransaction.name}`,
      Task.ru,
      id,
    );
  }

  private async deleteWithTransaction(
    id: TaskData['id'],
    transaction: Transaction,
  ): Promise<void> {
    const destroyedCount = await Task.destroy(
      {where: {id}, limit: 1, transaction},
    );

    if (destroyedCount === 0) throw new ModelError.notFound(
      `${this.constructor.name}.${this.deleteWithTransaction.name}`,
      Task.ru,
      id,
    );
  }
})();