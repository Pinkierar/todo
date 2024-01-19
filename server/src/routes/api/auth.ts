import {Router} from 'express';
import {AuthController} from '#controllers';
import {authMiddleware, emptyAuthMiddleware} from '#middlewares';
import {bodyObject, toChains} from '#includes/validator';
import {ApiRoute} from '#includes/ApiRoute';
import {UserValidator} from '#entities/User';

export const AuthRoutes = (inRouter: Router) => {
  ApiRoute.signIn.addRoute(inRouter, [
    toChains(bodyObject({
      'email': UserValidator.email,
      'password': UserValidator.password,
    })),
    emptyAuthMiddleware,
  ], AuthController.signIn);

  ApiRoute.getToken.addRoute(inRouter, [
    authMiddleware,
  ], AuthController.getToken);

  ApiRoute.signOut.addRoute(inRouter, [
    authMiddleware,
  ], AuthController.signOut);
};