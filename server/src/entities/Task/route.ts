import {TaskController, TaskValidator} from '#entities/Task';
import {ApiRoute} from '#includes/ApiRoute';
import {bodyObject, param, toChains, toOptionalChains} from '#includes/validator';
import {authMiddleware} from '#middlewares';
import {Router} from 'express';

export const TaskRoutes = (inRouter: Router) => {
  ApiRoute.getTasks.addRoute(inRouter, [
    authMiddleware,
  ], TaskController.getAll);

  ApiRoute.getTask.addRoute(inRouter, [
    param('id').isInteger().getChain(),
    authMiddleware,
  ], TaskController.get);

  ApiRoute.createTask.addRoute(inRouter, [
    toChains(bodyObject(TaskValidator)),
    authMiddleware,
  ], TaskController.create);

  ApiRoute.editTask.addRoute(inRouter, [
    param('id').isInteger().getChain(),
    toOptionalChains(bodyObject(TaskValidator)),
    authMiddleware,
  ], TaskController.edit);

  ApiRoute.deleteTask.addRoute(inRouter, [
    param('id').isInteger().getChain(),
    authMiddleware,
  ], TaskController.delete);
};