import {ApiRoute, Controller, createController} from '#includes/ApiRoute';
import {StatusService} from '#entities/Status';

export const StatusController = new (class StatusController implements Controller {
  public readonly getAll = createController(ApiRoute.getStatuses, async () => {
    return await StatusService.getAll();
  });

  public readonly get = createController(ApiRoute.getStatus, async req => {
    const id = Number(req.params.id);

    return {
      data: await StatusService.get(id),
    };
  });
})();