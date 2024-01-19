import {InferAttributes, InferCreationAttributes, Model} from 'sequelize';

export class BaseModel<
  Parent extends Model<{ id: number }, {}>,
> extends Model<
  InferAttributes<Parent>,
  InferCreationAttributes<Parent>
> {
  declare id: number;

  public static readonly ru: string = '';
}