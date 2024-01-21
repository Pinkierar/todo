import {PriorityRoutes} from '#entities/Priority';
import {StatusRoutes} from '#entities/Status';
import {TaskRoutes} from '#entities/Task';
import {Router} from 'express';
import {AccountRoutes} from './account';
import {AuthRoutes} from './auth';
import {UserRoutes} from '#entities/User';
import {Route} from '#includes/ApiRoute';
import {RequestError} from '#errors';
import {
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
import compression from 'compression';

export const ApiRouter = Router();

ApiRouter.use(helmet());
ApiRouter.use(bodyParser.json({
  limit: '10GB',
}));
ApiRouter.use(cookieParser());
ApiRouter.use(compression());
ApiRouter.use(initMiddleware);
ApiRouter.use(performance.startMiddleware);
ApiRouter.use(jwtMiddleware);

AccountRoutes(ApiRouter);
AuthRoutes(ApiRouter);
PriorityRoutes(ApiRouter);
UserRoutes(ApiRouter);
StatusRoutes(ApiRouter);
TaskRoutes(ApiRouter);

Route.add(ApiRouter, 'all', '/*', [], async () => {
  throw new RequestError.requestDoesNotExist('end routes/api');
});

ApiRouter.use(responseMiddleware);
ApiRouter.use(errorMiddleware);
ApiRouter.use(combinedMiddleware);
