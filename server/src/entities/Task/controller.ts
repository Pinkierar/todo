import {TaskService} from '#entities/Task';
import {TaskArgs} from '#global';
import {ApiRoute, ControllerFull, createController} from '#includes/ApiRoute';
import {Validator} from '#includes/validator';

export const TaskController = new (class TaskController implements ControllerFull {
  public readonly create = createController(ApiRoute.createTask, async req => {
    const UserId = req.jwt.user!.id;
    const args = this.normalizeArgs(req.body);

    return {
      data: await TaskService.create({...args, UserId}),
    };
  });

  public readonly getAll = createController(ApiRoute.getTasks, async () => {
    return await TaskService.getAll();
  });

  public readonly get = createController(ApiRoute.getTask, async req => {
    const id = Number(req.params.id);

    return {
      data: await TaskService.get(id),
    };
  });

  public readonly edit = createController(ApiRoute.editTask, async req => {
    const id = Number(req.params.id);
    const args = this.normalizeArgs(req.body);

    return {
      data: await TaskService.edit(id, args),
    };
  });

  public readonly delete = createController(ApiRoute.deleteTask, async req => {
    const id = Number(req.params.id);

    await TaskService.delete(id);
  });

  // private:

  private normalizeArgs<A extends Partial<TaskArgs>>(args: A): A {
    return {
      ...args,
      name: args.name && Validator.normalize(args.name),
      description: args.description && Validator.normalize(args.description),
    };
  }
})();