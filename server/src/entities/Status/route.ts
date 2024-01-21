import {StatusController} from '#entities/Status';
import {ApiRoute} from '#includes/ApiRoute';
import {param} from '#includes/validator';
import {authMiddleware} from '#middlewares';
import {Router} from 'express';

export const StatusRoutes = (inRouter: Router) => {
  ApiRoute.getStatuses.addRoute(inRouter, [
    authMiddleware,
  ], StatusController.getAll);

  ApiRoute.getStatus.addRoute(inRouter, [
    param('id').isInteger().getChain(),
    authMiddleware,
  ], StatusController.get);
};