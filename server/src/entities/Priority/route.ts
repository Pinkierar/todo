import {PriorityController} from '#entities/Priority';
import {ApiRoute} from '#includes/ApiRoute';
import {param} from '#includes/validator';
import {authMiddleware} from '#middlewares';
import {Router} from 'express';

export const PriorityRoutes = (inRouter: Router) => {
  ApiRoute.getPriorities.addRoute(inRouter, [
    authMiddleware,
  ], PriorityController.getAll);

  ApiRoute.getPriority.addRoute(inRouter, [
    param('id').isInteger().getChain(),
    authMiddleware,
  ], PriorityController.get);
};