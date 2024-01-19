import {authMiddleware} from '#middlewares';
import {bodyObject, toChains} from '#includes/validator';
import {AuthController} from '#controllers';
import {Router} from 'express';
import {ApiRoute} from '#includes/ApiRoute';
import {config} from '#config';

const {min, max} = config.global.lengths;

export const RootRoutes = (inRouter: Router) => {
  ApiRoute.changePassword.addRoute(inRouter, [
    toChains(bodyObject({
      'oldPassword': key =>
        key.isString(min.password, max.base),
      'newPassword': key =>
        key.isString(min.password, max.base),
    })),
    authMiddleware,
  ], AuthController.changePassword);
};