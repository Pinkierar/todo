import {BaseData} from '../../';

export enum StatusId {
  open = 1,
  inProcess,
  done,
  inArchive,
}

export type StatusData = BaseData<{
  id: StatusId,
  name: string,
  color: number,
  order: number,
}>;

/*
Number.parseInt('007ecd', 16)
(32461).toString(16).padStart(6, '0')
*/

export const statuses: { readonly [id in StatusId]: StatusData } = {
  [StatusId.open]: {
    id: StatusId.open,
    name: 'Открыто',
    color: 8421504,
    order: 1,
  },
  [StatusId.inProcess]: {
    id: StatusId.inProcess,
    name: 'В процессе',
    color: 32461,
    order: 2,
  },
  [StatusId.done]: {
    id: StatusId.done,
    name: 'Завершено',
    color: 15551821,
    order: 3,
  },
  [StatusId.inArchive]: {
    id: StatusId.inArchive,
    name: 'В архиве',
    color: 13696928,
    order: 4,
  },
};