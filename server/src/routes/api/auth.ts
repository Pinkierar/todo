import {config} from '#config';
import {AuthController} from '#controllers';
import type {LoginArgs} from '#global';
import {ApiRoute} from '#includes/ApiRoute';
import {bodyObject, toChains, ValidatorType} from '#includes/validator';
import {authMiddleware, emptyAuthMiddleware} from '#middlewares';
import {Router} from 'express';

const {min, max} = config.global.lengths;

const signInValidator: ValidatorType<LoginArgs> = {
  email: key => key.isEmail(),
  password: key => key.isString(min.password, max.base),
};

export const AuthRoutes = (inRouter: Router) => {
  ApiRoute.signIn.addRoute(inRouter, [
    toChains(bodyObject(signInValidator)),
    emptyAuthMiddleware,
  ], AuthController.signIn);

  ApiRoute.getToken.addRoute(inRouter, [
    authMiddleware,
  ], AuthController.getToken);

  ApiRoute.signOut.addRoute(inRouter, [
    authMiddleware,
  ], AuthController.signOut);
};