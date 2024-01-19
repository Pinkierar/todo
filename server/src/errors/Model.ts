import {BaseError} from './Base';
import {BadCode} from '#global';

export class ModelError extends BaseError {
  public static notFound = class extends ModelError {
    constructor(
      where: string,
      who: string,
      id: number | number[],
      errors: any[] = [],
    ) {
      super(
        BadCode.badRequest,
        where,
        `${who} с идентификатором "${Array.isArray(id) ? id.join('/') : id}" отсутствует`,
        errors,
      );
    }
  };

  public static alreadyExists = class extends ModelError {
    constructor(
      where: string,
      who: string,
      name: string,
      errors: any[] = [],
    ) {
      super(
        BadCode.badRequest,
        where,
        `${who} "${name}" уже существует`,
        errors,
      );
    }
  };
}