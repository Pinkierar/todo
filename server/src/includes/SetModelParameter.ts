import {InferAttributes, InferCreationAttributes, Model, Optional, WhereOptions} from 'sequelize';
import {NullishPropertiesOf} from 'sequelize/types/utils';

export type SetModelParameter<T extends Model> = {
  where: WhereOptions<InferAttributes<T>>,
  defaults: Optional<InferCreationAttributes<T>, NullishPropertiesOf<InferCreationAttributes<T>>>,
};