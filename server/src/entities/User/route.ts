import {UserController, UserValidator} from '#entities/User';
import {ApiRoute} from '#includes/ApiRoute';
import {bodyObject, toChains} from '#includes/validator';
import {emptyAuthMiddleware} from '#middlewares';
import {Router} from 'express';

const bodyRegisterValidator = {
  'name': UserValidator.name,
  'email': UserValidator.email,
  'password': UserValidator.password,
} as const;

export const UserRoutes = (inRouter: Router) => {
  ApiRoute.signUp.addRoute(inRouter, [
    toChains(bodyObject(bodyRegisterValidator)),
    emptyAuthMiddleware,
  ], UserController.register);
};