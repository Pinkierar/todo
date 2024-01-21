import {ApiRoute, Controller, createController} from '#includes/ApiRoute';
import {PriorityService} from '#entities/Priority';

export const PriorityController = new (class PriorityController implements Controller {
  public readonly getAll = createController(ApiRoute.getPriorities, async () => {
    return await PriorityService.getAll();
  });

  public readonly get = createController(ApiRoute.getPriority, async req => {
    const id = Number(req.params.id);

    return {
      data: await PriorityService.get(id),
    };
  });
})();