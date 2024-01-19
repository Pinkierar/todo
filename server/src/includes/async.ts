export class Async {
  public static forEach<T>(
    array: T[],
    callback: (item: T, index: number) => Promise<unknown>,
  ): Promise<void>
  public static async forEach<T>(
    array: T[],
    callback: (item: T, index: number) => Promise<unknown>,
  ): Promise<void> {
    for (let i = 0; i < array.length; i++)
      await callback(array[i], i);
  }

  public static map<T, K>(
    array: T[],
    callback: (item: T, index: number) => Promise<K | null | undefined>,
  ): Promise<K[]>
  public static map<T, K>(
    array: T[],
    callback: (item: T, index: number) => Promise<K | null | undefined>,
    filterNulls: false,
  ): Promise<(K | null | undefined)[]>
  public static async map<T, K>(
    array: T[],
    callback: (item: T, index: number) => Promise<K | null | undefined>,
    filterNulls: boolean = true,
  ): Promise<(K | null | undefined)[] | K[]> {
    const out: (K | null | undefined)[] = [];

    await Async.forEach<T>(
      array,
      async (item, index) =>
        out.push(await callback(item, index)),
    );

    if (filterNulls) return out.flatMap(v => v === null || v === undefined ? [] : [v]);

    return out;
  }
}