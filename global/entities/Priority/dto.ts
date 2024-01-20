import {BaseData} from '../../';

export enum PriorityId {
  low = 1,
  normal,
  high,
}

export type PriorityData = BaseData<{
  id: PriorityId,
  name: string,
  color: number,
}>;

/*
Number.parseInt('007ecd', 16)
(32461).toString(16).padStart(6, '0')
*/

export const priorities: { readonly [id in PriorityId]: PriorityData } = {
  [PriorityId.low]: {
    id: PriorityId.low,
    name: 'Низкий',
    color: 8421504,
  },
  [PriorityId.normal]: {
    id: PriorityId.normal,
    name: 'Нормальный',
    color: 32461,
  },
  [PriorityId.high]: {
    id: PriorityId.high,
    name: 'Высокий',
    color: 15551821,
  },
};