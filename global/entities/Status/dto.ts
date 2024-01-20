import {BaseData} from '../../';

export type StatusData = BaseData<{
  id: number,
  name: string,
  color: number,
  order: number,
}>;

export type StatusArgs =
  Pick<StatusData, 'name' | 'color'>
  & Partial<Pick<StatusData, 'order'>>;

export type StatusEditionArgs =
  Partial<StatusArgs>
  & Pick<StatusData, 'id'>;