import {Model as SequelizeModel} from 'sequelize/types/model';
import {ModelStatic} from 'sequelize';

export class Relation {
  public static oneIn<M extends SequelizeModel>(
    One: ModelStatic<M>,
    In: ModelStatic<M>,
    as: string,
  ): void
  public static oneIn<FM extends SequelizeModel, SM extends SequelizeModel>(
    One: ModelStatic<SM extends FM ? never : SM>,
    In: ModelStatic<FM>,
  ): void
  public static oneIn(
    One: ModelStatic<SequelizeModel>,
    In: ModelStatic<SequelizeModel>,
    as?: string,
  ): void {
    if (In === One) {
      if (!as) throw new Error('need as');

      In.belongsTo(One, {as});
    } else {
      In.belongsTo(One, {as});
      One.hasMany(In, {as});
    }
  }

  public static manyToMany<M extends SequelizeModel>(
    First: ModelStatic<M>,
    Second: ModelStatic<M>,
    Through: ModelStatic<SequelizeModel> | string,
    as: string,
  ): void
  public static manyToMany<FM extends SequelizeModel, SM extends SequelizeModel>(
    First: ModelStatic<FM>,
    Second: ModelStatic<SM extends FM ? never : SM>,
    Through: ModelStatic<SequelizeModel> | string,
  ): void
  public static manyToMany(
    First: ModelStatic<SequelizeModel>,
    Second: ModelStatic<SequelizeModel>,
    Through: ModelStatic<SequelizeModel> | string,
    as?: string,
  ): void {
    if (First === Second) {
      if (!as) throw new Error('need as');

      First.belongsToMany(Second, {through: Through, as});
    } else {
      First.belongsToMany(Second, {through: Through});
      Second.belongsToMany(First, {through: Through});
    }
  };
}