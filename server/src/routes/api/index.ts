import {Router} from 'express';
import {RootRoutes} from './root';
import {AuthRoutes} from './auth';
import {UserRoutes} from '#entities/User';
import {Route} from '#includes/ApiRoute';
import {RequestError} from '#errors';
import {
  cacheUpdater,
  combinedMiddleware,
  errorMiddleware,
  initMiddleware,
  jwtMiddleware,
  performance,
  responseMiddleware,
} from '#middlewares';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import compression from 'compression';

export const ApiRouter = Router();

ApiRouter.use(helmet());
ApiRouter.use(bodyParser.json({
  limit: '10GB',
}));
ApiRouter.use(cookieParser());
ApiRouter.use(fileUpload({
  limitHandler: (_req, _res, next) => {
    next(new RequestError.payloadTooLarge('fileUpload > limitHandler'));
  },
  uploadTimeout: 0,
  parseNested: true,
}));
ApiRouter.use(compression());
ApiRouter.use(initMiddleware);
ApiRouter.use(performance.startMiddleware);
ApiRouter.use(jwtMiddleware);

RootRoutes(ApiRouter);
AuthRoutes(ApiRouter);
UserRoutes(ApiRouter);

Route.add(ApiRouter, 'all', '/*', [], async () => {
  throw new RequestError.requestDoesNotExist('end routes/api');
});

ApiRouter.use(responseMiddleware);
ApiRouter.use(cacheUpdater);
ApiRouter.use(errorMiddleware);
ApiRouter.use(combinedMiddleware);
