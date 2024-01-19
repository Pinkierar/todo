import {BadCode} from '#global';
import {BaseError} from './Base';

export class RequestError extends BaseError {
  public static badRequest = class extends RequestError {
    constructor(
      where: string,
      message: string,
      errors: any[] = [],
    ) {
      super(
        BadCode.badRequest,
        where,
        message,
        errors,
      );
    }
  };

  public static payloadTooLarge = class extends RequestError {
    constructor(
      where: string,
      errors: any[] = [],
    ) {
      super(
        BadCode.payloadTooLarge,
        where,
        'Отправляемые данные слишком велики',
        errors,
      );
    }
  };

  public static unauthorized = class extends RequestError {
    constructor(
      where: string,
      errors: any[] = [],
    ) {
      super(
        BadCode.unauthorized,
        where,
        'Не авторизован',
        errors,
      );
    }
  };

  public static unavailable = class extends RequestError {
    constructor(
      where: string,
      errors: any[] = [],
    ) {
      super(
        BadCode.unavailable,
        where,
        'Нет доступа',
        errors,
      );
    }
  };

  public static requestDoesNotExist = class extends RequestError {
    constructor(
      where: string,
      errors: any[] = [],
    ) {
      super(
        BadCode.notFound,
        where,
        'Запрос не существует',
        errors,
      );
    }
  };
}