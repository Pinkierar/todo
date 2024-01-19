export class SuperArray<T = undefined> {
  private readonly array_: T[];

  public constructor(iterable: Iterable<T> | ArrayLike<T>)
  public constructor(length: number)
  public constructor(length: number, callback?: (index: number) => T)
  public constructor(length: number, value: T)
  public constructor(
    iterableOrLength: (Iterable<T> | ArrayLike<T>) | number,
    valueOrCallback?: T | ((index: number) => T),
  ) {
    const isCallback = valueOrCallback instanceof Function;

    const value = isCallback
      ? undefined
      : valueOrCallback;

    this.array_ = typeof iterableOrLength === 'number'
      ? Array(iterableOrLength).fill(value).map((v, i) => isCallback ? valueOrCallback(i) : v)
      : Array.from(iterableOrLength);
  }

  public static from<T = undefined>(iterable: Iterable<T> | ArrayLike<T>): SuperArray<T> {
    return new SuperArray(iterable);
  }

  public includes(searchElement: T): boolean
  public includes(searchElements: T[]): boolean
  public includes(...searchElements: T[]): boolean
  public includes(searchElementsInSArray: SuperArray<T>): boolean
  public includes(searchFirst: T | T[] | SuperArray<T>, ...search: T[]): boolean {
    const searchElements = searchFirst instanceof SuperArray
      ? searchFirst.array
      : Array.isArray(searchFirst)
        ? searchFirst
        : [searchFirst, ...search];

    for (let currentElement of this.array)
      if (searchElements.includes(currentElement)) return true;

    return false;
  }

  public includesAll(searchElement: T): boolean
  public includesAll(searchElements: T[]): boolean
  public includesAll(...searchElements: T[]): boolean
  public includesAll(searchElementsInSArray: SuperArray<T>): boolean
  public includesAll(searchFirst: T | T[] | SuperArray<T>, ...search: T[]): boolean {
    const searchElements = searchFirst instanceof SuperArray
      ? searchFirst.array
      : Array.isArray(searchFirst)
        ? searchFirst
        : [searchFirst, ...search];

    return searchElements.filter(item => this.includes(item)).length === searchElements.length;
  }

  public equals(searchElements: T[]): boolean
  public equals(searchElementsInSArray: SuperArray<T>): boolean
  public equals(search: T[] | SuperArray<T>): boolean {
    const searchElements = search instanceof SuperArray
      ? search.array
      : search;

    if (searchElements.length !== this.array.length) return false;

    for (let i = 0; i < this.length; i++)
      if (this.array[i] !== searchElements[i]) return false;

    return true;
  }

  public removeRepeats(): SuperArray<T> {
    return SuperArray.from(new Set(this.array));
  }

  public flatMap<U, This = undefined>(
    callback: (
      this: This,
      value: T,
      index: number,
      array: T[],
    ) => (U | readonly U[]),
    thisArg?: This,
  ): SuperArray<U> {
    return SuperArray.from(this.array.flatMap(callback, thisArg));
  }

  public map<U, This = undefined>(
    callback: (this: This, value: T, index: number, array: T[]) => U,
    thisArg?: This,
  ): SuperArray<U> {
    return SuperArray.from(this.array.map(callback, thisArg));
  }

  public findPair(checkNulls: boolean = false): T | undefined {
    for (let f = 0; f < this.array.length; f++)
      for (let s = f + 1; s < this.array.length; s++) {
        if (!checkNulls) {
          if (this.array[f] === null || this.array[f] === undefined) return;
          if (this.array[s] === null || this.array[s] === undefined) return;
        }
        if (this.array[f] === this.array[s]) return this.array[f];
      }
  }

  public get array(): T[] {
    return this.array_;
  }

  public getArray(): T[] {
    return this.array_;
  }

  public get length() {
    return this.array.length;
  }
}

(globalThis as any).SuperArray = SuperArray;