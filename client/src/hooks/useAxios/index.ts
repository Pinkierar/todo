import {useEffect, useState} from 'react';
import {ParsedQs, SureObject} from '#global';
import {Route} from '#includes/ApiRoute';
import {AxiosHook} from './Hook';
import {Fail} from '#includes/axios';

type UseAxiosProps<
  P extends { [p: string]: string | number } | null,
  D extends SureObject = {},
  A = undefined,
  Q extends ParsedQs | undefined = undefined,
> = Readonly<{
  cache?: ((data: D) => any) | null,
  success?: ((data: D) => any) | null,
  fail?: ((failData: Fail) => any) | null,
  shouldSend?: Q extends undefined ? A extends undefined ? P extends null ? true : false : false : false,
}>;

export function useAxios<
  P extends { [p: string]: string | number } | null = null,
  D extends SureObject = {},
  A = undefined,
  Q extends ParsedQs | undefined = undefined,
>(
  route: Route<P, D, A, Q>,
  props: UseAxiosProps<P, D, A, Q> = {},
): AxiosHook<P, D, A, Q> {
  const {
    success,
    cache,
    fail,
    shouldSend,
  } = props;

  const hook = new AxiosHook<P, D, A, Q>(
    route,
    useState<D | null>(null),
    useState<Fail | null>(null),
    useState<boolean>(false),
    useState<D | undefined>(undefined),
  );

  useEffect(() => {
    if (!success || !hook.success) return;

    success(hook.success);
  }, [hook.success]);

  useEffect(() => {
    if (!cache || !hook.cache) return;

    cache(hook.cache);
  }, [hook.cache]);

  useEffect(() => {
    if (!fail || !hook.fail) return;

    fail(hook.fail);
  }, [hook.fail]);

  useEffect(() => {
    shouldSend && (hook as AxiosHook<any, any, any, any>).request();

    return () => {
      hook.cancel();
    };
  }, []);

  return hook;
}

export {
  AxiosHook,
};