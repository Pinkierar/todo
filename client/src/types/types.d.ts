import {Dispatch, SetStateAction} from 'react';

declare global {
  type UseStateReturnType<S> = [S, Dispatch<SetStateAction<S>>];

  type ValueOf<T> = T[keyof T];
  type Falsy = false | 0 | '' | null | undefined;
  // type ClassByInstance<Instance> = { new(...args: any[]): Instance };

  // type AllowedFieldsWithType<Obj, Type> = { [K in keyof Obj]: Obj[K] extends Type ? K : never };
  // type ExtractFieldsOfType<Obj, Type> = AllowedFieldsWithType<Obj, Type>[keyof Obj];
}