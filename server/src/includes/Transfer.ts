import {BaseData} from '#global';
import {ModelError} from '#errors';
import {Model, ModelStatic} from 'sequelize';
import {BaseModel} from '#includes/BaseModel';

type TransferSettings<
  MI extends BaseModel<Model>,
  Dto extends BaseData<any>,
  MS extends typeof BaseModel<Model>,
  M extends InstanceType<ModelStatic<MI>>,
> = Readonly<{
  Model: MS,
  modelById: (id: M['id']) => Promise<M | null>,
  modelsByIds: (ids: M['id'][]) => Promise<M[]>,
  modelByModel?: (model: M) => Promise<M>,
  modelToData: (model: M) => Dto,
}>;

export class Transfer<
  MI extends BaseModel<Model>,
  Dto extends BaseData<any>,
  MS extends typeof BaseModel<Model> = typeof BaseModel<Model>,
  M extends InstanceType<ModelStatic<MI>> = InstanceType<ModelStatic<MI>>,
> {
  private readonly settings: TransferSettings<MI, Dto, MS, M>;

  public constructor(settings: TransferSettings<MI, Dto, MS, M>) {
    this.settings = settings;
  }

  public get(id: M['id']): Promise<Dto>
  public get(models: M[]): Promise<Dto[]>
  public get(model: M): Promise<Dto>
  public get(ids: M['id'][]): Promise<Dto[]>
  public get(targets: (M | M['id'])[]): Promise<Dto[]>
  public async get(
    target: M | M['id'] | (M | M['id'])[],
  ): Promise<Dto | Dto[]> {
    if (Array.isArray(target))
      return this.getMany(target);

    const model = await this.byTarget(target);

    return this.settings.modelToData(model);
  }

  private async getMany(targets: (M | M['id'])[]): Promise<Dto[]> {
    const models = await this.byTargets(targets);

    return models.map(this.settings.modelToData);
  }

  private async byTarget(target: M | M['id']): Promise<M> {
    if (target instanceof this.settings.Model)
      return this.settings.modelByModel
        ? this.settings.modelByModel(target)
        : target;

    const modelById = await this.settings.modelById(target);
    if (!modelById) throw new ModelError.notFound(
      `${this.constructor.name}.${this.byTargets.name}`,
      this.settings.Model.ru,
      target,
    );

    return modelById;
  }

  private async byTargets(targets: (M | M['id'])[]): Promise<M[]> {
    const [models, ids] = targets.reduce<[M[], M['id'][]]>(
      ([models, ids], target) => (
        target instanceof this.settings.Model
          ? [[...models, target], ids]
          : [models, [...ids, target]]
      ),
      [[], []],
    );
    if (models.length === targets.length)
      return await this.byModels(models);

    // Для оптимизации: Этот массив опустошается (здесь: modelsByIds.splice)
    const modelsByIds = await this.settings.modelsByIds(ids);
    if (modelsByIds.length === targets.length)
      return modelsByIds;

    const [modelsByTargets, errorIds] = targets.reduce<[M[], M['id'][]]>(
      ([modelsByTargets, errorIds], target) => {
        if (target instanceof this.settings.Model)
          return [[...modelsByTargets, target], errorIds];

        const modelByIdIndex = modelsByIds.findIndex(({id}) => id === target);
        if (modelByIdIndex === -1)
          return [modelsByTargets, [...errorIds, target]];

        const [modelById] = modelsByIds.splice(modelByIdIndex, 1);

        return [[...modelsByTargets, modelById], errorIds];
      },
      [[], []],
    );

    if (errorIds.length > 0) throw new ModelError.notFound(
      `${this.constructor.name}.${this.byTargets.name}`,
      this.settings.Model.ru,
      errorIds,
    );

    return await this.byModels(modelsByTargets);
  }

  private async byModels(models: M[]): Promise<M[]> {
    if (!this.settings.modelByModel)
      return Promise.resolve(models);

    return await Promise.all(models.map(this.settings.modelByModel));
  }
}