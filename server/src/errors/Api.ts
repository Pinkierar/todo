import {BaseError} from './Base';
import {BadCode} from '#global';

export class ApiError extends BaseError {
  public static internal = class extends ApiError {
    constructor(
      where: string,
      message: string,
      errors: any[] = [],
    ) {
      super(
        BadCode.internal,
        where,
        message,
        errors,
      );
    }
  };
}