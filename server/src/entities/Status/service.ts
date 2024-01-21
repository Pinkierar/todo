import {Status, StatusTransfer} from '#entities/Status';
import {StatusData} from '#global';

export const StatusService = new (class StatusService {
  public async get(id: StatusData['id']): Promise<StatusData> {
    return await StatusTransfer.get(id);
  }

  public async getAll(): Promise<StatusData[]> {
    const statuses = await Status.findAll();

    return Promise.all(statuses.map(
      status => StatusTransfer.get(status),
    ));
  }
})();