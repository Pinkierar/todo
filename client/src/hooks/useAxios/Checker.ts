import {useEffect, useMemo} from 'react';
import {FailData} from '#global';
import type {AxiosHook} from './Hook';

class AxiosChecker {
  public static successDeps(hooks: readonly AxiosHook<any, any, any, any>[]): (any | null)[] {
    return hooks.map(hook => hook.success);
  }

  public static isAllSuccess(hooks: readonly AxiosHook<any, any, any, any>[]): boolean {
    return !hooks.find(hook => !hook.success);
  }

  public static failDeps(hooks: AxiosHook<any, any, any, any>[]): (FailData | null)[] {
    return hooks.map(hook => hook.fail);
  }

  public static getFails(hooks: AxiosHook<any, any, any, any>[]): FailData[] {
    return hooks.filter(hook => hook.fail).map(axios => axios.fail!);
  }

  public static cacheDeps(hooks: readonly AxiosHook<any, any, any, any>[]): (any | null)[] {
    return hooks.map(hook => hook.cache);
  }

  public static isAllCache(hooks: readonly AxiosHook<any, any, any, any>[]): boolean {
    return !hooks.find(hook => !hook.cache);
  }
}

export function useSuccessEffect<Hooks extends readonly AxiosHook<any, any, any, any>[]>(
  hooks: Hooks,
  callback: (...args: { [index in keyof Hooks]: NonNullable<Hooks[index]['success']> }) => void,
): void {
  useEffect(() => {
    if (!AxiosChecker.isAllSuccess(hooks)) return;
    callback(...hooks.map(hook => hook.success!) as any);
  }, [...AxiosChecker.successDeps(hooks)]);
}

export function useSuccessMemo<Hooks extends readonly AxiosHook<any, any, any, any>[], ReturnType>(
  hooks: Hooks,
  callback: (...args: { [index in keyof Hooks]: NonNullable<Hooks[index]['success']> }) => ReturnType,
  defaultValue: ReturnType,
): ReturnType {
  return useMemo<ReturnType>(() => {
    if (!AxiosChecker.isAllSuccess(hooks)) return defaultValue;
    return callback(...hooks.map(hook => hook.success!) as any);
  }, hooks);
}

export function useFailEffect(
  callback: (fails: FailData[]) => void,
  hooks: AxiosHook<any, any, any, any>[],
): void {
  useEffect(() => {
    const fails = AxiosChecker.getFails(hooks);
    if (fails.length === 0) return;
    callback(fails);
  }, [...AxiosChecker.failDeps(hooks)]);
}

export function useCacheEffect<Hooks extends readonly AxiosHook<any, any, any, any>[]>(
  hooks: Hooks,
  callback: (...args: { [index in keyof Hooks]: NonNullable<Hooks[index]['cache']> }) => void,
): void {
  useEffect(() => {
    if (!AxiosChecker.isAllCache(hooks)) return;
    callback(...hooks.map(hook => hook.cache!) as any);
  }, [...AxiosChecker.cacheDeps(hooks)]);
}

export function useCacheMemo<Hooks extends readonly AxiosHook<any, any, any, any>[], ReturnType>(
  hooks: Hooks,
  callback: (...args: { [index in keyof Hooks]: NonNullable<ValueOf<Pick<Hooks[index], 'cache'>>> }) => ReturnType,
  defaultValue: ReturnType,
  deps: unknown[] = [],
): ReturnType {
  return useMemo<ReturnType>(() => {
    if (!AxiosChecker.isAllCache(hooks)) return defaultValue;
    return callback(...hooks.map(hook => hook.cache!) as any);
  }, [...hooks, ...deps]);
}

export function useIsLoading(hooks: AxiosHook<any, any, any, any>[]): boolean {
  return useMemo(
    () => Boolean(hooks.find(hook => hook.isLoading)),
    [...hooks.map(hook => hook.isLoading)],
  );
}