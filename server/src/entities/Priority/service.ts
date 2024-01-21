import {Priority, PriorityTransfer} from '#entities/Priority';
import {PriorityData} from '#global';

export const PriorityService = new (class PriorityService {
  public async get(id: PriorityData['id']): Promise<PriorityData> {
    return await PriorityTransfer.get(id);
  }

  public async getAll(): Promise<PriorityData[]> {
    const priorities = await Priority.findAll();

    return Promise.all(priorities.map(
      priority => PriorityTransfer.get(priority),
    ));
  }
})();