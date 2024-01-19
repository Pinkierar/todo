import * as ev from 'express-validator';

export type Validators = Validator | Validators[];

export type ValidatorType<EditionArgs extends { id: number }> = {
  [key in keyof Required<EditionArgs>]: (key: Validator) => Validator | Validators | Validators[]
};

enum Target {
  body = 'body',
  param = 'param',
  query = 'query',
}

export class Validator {
  private readonly target: Target;
  private readonly field?: string;
  private readonly chain: ev.ValidationChain;

  public constructor(target: Target, field: string = '') {
    this.target = target;
    this.field = field;
    this.chain = ev[this.target](this.field);
  }

  public getChain(): ev.ValidationChain {
    return this.chain;
  }

  public isAny(): Validator;
  public isAny(): Validator {
    return this;
  }

  public isString(minLength?: number, maxLength?: number): Validator;
  public isString(values?: string[]): Validator;
  public isString(arg1?: number | string[], arg2?: number): Validator {
    this.chain.isString().trim();

    Array.isArray(arg1)
      ? this.chain.isIn(arg1)
      : this.chain.isLength({min: arg1, max: arg2});

    return this;
  }

  public isEmail() {
    this.isString().chain.normalizeEmail({all_lowercase: true}).isEmail();

    return this;
  }

  public isInteger(): Validator {
    this.chain.isNumeric({no_symbols: true});

    return this;
  }

  public isDate(): Validator {
    this.chain.isDate({format: 'DD.MM.YYYY', delimiters: ['.']});

    return this;
  }

  public isFloat(): Validator {
    this.chain.isNumeric();

    return this;
  }

  public isBoolean(): Validator {
    this.chain.isBoolean();

    return this;
  }

  public isArray(
    items: (key: Validator) => Validator | Validators[],
    minLength?: number,
  ): Validators[] {
    this.chain.isArray({min: minLength});

    const validator = new Validator(this.target, `${this.field}.*`);
    const validation = items(validator);
    const validators = Validator.toArray(validation);

    return [this, ...validators];
  }

  public isObject(
    items: { [p: string]: (key: Validator) => Validator | Validators[] },
  ): Validators[] {
    this.chain.isObject({strict: true});

    const validators = Object.entries(items).reduce<Validators[]>((prev, [key, item]) => {
      const validator = new Validator(this.target, `${this.field}.${key}`);
      const validation = item(validator);
      const validators = Validator.toArray(validation);
      return [...prev, ...validators];
    }, []);

    return [this, ...validators];
  }

  public optional() {
    this.chain.optional({checkFalsy: true});

    return this;
  }

  public static normalize(text: string): string {
    return text
      .replace(/\s+/g, ' ')
      .trim();
  }

  public static removeSpaces(text: string): string {
    return text
      .replace(/\s/g, '');
  }

  public static toArray(validator: Validator | Validators | Validators[]) {
    return Array.isArray(validator) ? validator : [validator];
  }
}

export const body = (field?: string) =>
  new Validator(Target.body, field);
export const bodyObject = (...args: Parameters<Validator['isObject']>) =>
  body().isObject(...args);
export const bodyArray = (...args: Parameters<Validator['isArray']>) =>
  body().isArray(...args);
export const param = (field: string) =>
  new Validator(Target.param, field);
export const query = (field: string) =>
  new Validator(Target.query, field);

export const getValidators = (validators: Validator | Validators | Validators[]): Validator[] =>
  Validator.toArray(validators).flat(20) as Validator[];
export const toChains = (validators: Validator | Validators | Validators[]): ev.ValidationChain[] =>
  getValidators(validators).map(v => v.getChain());
export const toOptional = (validators: Validator | Validators | Validators[]): Validators[] =>
  getValidators(validators).map(v => v.optional());
export const toOptionalChains = (validators: Validator | Validators | Validators[]): ev.ValidationChain[] =>
  toChains(toOptional(validators));