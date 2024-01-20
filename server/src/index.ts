import {config} from '#config';
import {BadCode} from '#global';
import {logApiRoutes} from '#includes/ApiRoute';
import {clear, line, logUrl} from '#includes/console';
import {initializeModels} from '#includes/sequelize';
import {unknownErrorMiddleware} from '#middlewares';
import {ApiRouter} from '#route';
import {FileSystemService} from '#services';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
app.enable('strict routing');
app.use(cors({
  credentials: true,
  origin: true,
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
