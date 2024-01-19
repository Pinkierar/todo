import {BadCode, GoodCode} from '#global';

export class BaseError extends Error {
  public readonly code: BadCode | GoodCode;
  public readonly errors: any[];

  protected constructor(
    code: BadCode | GoodCode,
    where: string,
    message: string,
    errors: any[] = [],
  ) {
    super(message);

    this.code = code;
    this.errors = [
      where,
      ...errors,
    ];
  }
}