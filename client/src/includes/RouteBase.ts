export class RouteBase<
  Path extends string = string,
  Keys extends string | never = never
> extends String {
  public readonly _typeK: Keys;

  public constructor(path: Path, keys: Keys[] = []) {
    super(path);

    this._typeK = keys[0];

    keys.forEach(key => {
      const reg = new RegExp(`/:${key}`);

      if (!reg.test(path)) throw new Error(`В пути "${path}" нет ключа "${key}"`);
    });
  }

  public createUrl(params: Record<Keys, string | number>): string;
  public createUrl(): Keys extends never ? string : never;
  public createUrl(params?: Record<Keys, string | number> | never): string {
    return RouteBase.createUrl(String(this), params);
  }

  public static createUrl(path: string, params: Record<string, string | number> = {}): string {
    const paramKeys = Object.keys(params);

    return paramKeys.length === 0 ? path : paramKeys.reduce(
      (url, key) => url.replace(
        `:${key}`,
        String(params[key]),
      ),
      path,
    );
  }
}