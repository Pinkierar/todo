// noinspection RedundantConditionalExpressionJS,ConstantConditionalExpressionJS,PointlessBooleanExpressionJS

import {config as g_config} from '#global';
import path from 'path';

Error.stackTraceLimit = 25;

export const config = (() => {
  const app = (() => {
    const isProduction = process.env.NODE_ENV === 'production';
    const isHosting = process.env.IS_NOT_HOSTING !== 'true';

    return {isProduction, isHosting} as const;
  })();

  const server = (() => {
    const port = g_config.server.port;
    const type = 'http';
    const host = 'localhost';
    const url = `${type}://${host}:${port}` as const;

    return {port, type, host, url} as const;
  })();

  const jwt = (() => {
    const access = (() => {
      // noinspection SpellCheckingInspection
      const key = 'b55dbbb49a0137c6eb4720a1bd581e4d95ec02f0757cbfc518ba52877a565054';
      const expires = 900; // 15m

      return {key, expires} as const;
    })();

    const refresh = (() => {
      // noinspection SpellCheckingInspection
      const key = 'f57ae7aa962192cf69908c9f9a6032224b55af849764fa0bb7e3d0829d8dcc95';
      const expires = 1296000; // 15d
      const update = 432000;   // 5d

      return {key, expires, update} as const;
    })();

    return {access, refresh} as const;
  })();

  const db = (() => {
    const resetting = false;
    const name = 'todo';
    const login = 'todo';
    const password = 'K2z38lkMg8jkH2pK';
    const host = false ? 'mysql://localhost:3306/' : 'mysql://localhost:3306/';

    return {resetting, host, name, login, password} as const;
  })();

  const io = (() => {
    const root = app.isHosting
      ? path.join(__dirname, '..', '..', '..', '..')
      : path.join(__dirname, '..', '..');
    const errors = path.join(root, 'errors');
    const publ1c = path.join(root, 'public');
    const jwtUpdates = path.join(root, 'jwt-updates');

    return {root, errors, public: publ1c, jwtUpdates} as const;
  })();

  const logs = (() => {

    // Кратко значит, что все данные выводятся
    // в виде количества символов,
    // или в виде количества элементов в массиве
    const isBriefly = true;

    // Только пути значит, что выводится
    // только HTTP-метод, URL и время выполнения
    const onlyPaths = true;

    // Роуты значит, что при запуске сервера
    // выведутся все доступные роуты с их описанием
    const routes = false;

    return {isBriefly, onlyPaths, routes} as const;
  })();

  return {app, server, jwt, db, io, logs, global: g_config} as const;
})();