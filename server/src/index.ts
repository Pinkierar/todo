// noinspection BadExpressionStatementJS,CommaExpressionJS

require('dotenv').config();

import {FileSystemService} from '#services';
import express from 'express';
import cors from 'cors';
import {config} from '#config';
import {initializeModels} from '#includes/sequelize';
import {unknownErrorMiddleware} from '#middlewares';
import {clear, line, logUrl} from '#includes/console';
import {logApiRoutes} from '#includes/ApiRoute';
import {BadCode, DateTimeFormat} from '#global';
import {ApiRouter} from '#route';
import fs from 'fs';
import path from 'path';

(globalThis as any).whiteList = '';

const app = express();
app.enable('strict routing');
app.use(cors({
  credentials: true,
  origin: true,
  // origin: config.app.isProduction
  //   ? [config.server.url]
  //   : (() => {
  //     const nets = networkInterfaces();
  //
  //     const localIps = Object.values(nets).flatMap(info => info?.map(
  //       net => !net.internal && net.family === 'IPv4' && net.address,
  //     ).filter(ip => Boolean(ip)) as string[]);
  //
  //     localIps.push('localhost');
  //
  //     return localIps.map(ip => `http://${ip}:${config.ports.client}`)
  //   })();
  methods: ['GET', 'PUT', 'POST', 'DELETE'],
  allowedHeaders: ['Response-Hash', 'Content-Type', 'Authorization'],
}));
app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/api')) return next();

  if (req.originalUrl.length > 1) {
    if (req.originalUrl.endsWith('/') && req.originalUrl !== '/')
      return res.redirect(req.originalUrl.slice(0, -1));

    // Для файлов, помимо index.html
    const fileExist = fs.existsSync(path.join(config.io.public, req.originalUrl));
    if (fileExist) {
      return res.sendFile(
        req.originalUrl,
        {root: config.io.public},
      );
    }
  }

  return res.sendFile(
    'index.html',
    {root: config.io.public},
    () => res.status(BadCode.notFound).end(),
  );
});
app.use('/api', ApiRouter);
app.use(unknownErrorMiddleware);

(async () => {
  try {
    await initializeModels();

    app.listen(Number(config.server.port), '0.0.0.0', () => {
      if (!config.app.isProduction) {
        logUrl();
        config.logs.routes && logApiRoutes();
      }
    });
  } catch (e) {
    const error = e as Error;

    if (config.app.isProduction) {
      await FileSystemService.writeInFile(
        `${config.io.errors}/${Date.now()}.txt`,
        `${error.stack}\n\n${JSON.stringify(error, null, '  ')}`,
      );
    } else {
      clear(5);
      line('Ошибка при запуске сервера', [255, 0, 0]);
      console.log(error);
    }
  }
})();
