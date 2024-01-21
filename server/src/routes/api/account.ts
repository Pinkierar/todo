import {config} from '#config';
import {AccountController} from '#controllers';
import {ChangePasswordArgs, UserArgs} from '#global';
import {ApiRoute} from '#includes/ApiRoute';
import {bodyObject, toChains, ValidatorType} from '#includes/validator';
import {authMiddleware, emptyAuthMiddleware} from '#middlewares';
import {Router} from 'express';

const {min, max} = config.global.lengths;

const ChangePasswordValidator: ValidatorType<ChangePasswordArgs> = {
  oldPassword: key => key.isString(min.password, max.base),
  newPassword: key => key.isString(min.password, max.base),
};

const SignUpValidator: ValidatorType<UserArgs> = {
  name: key => key.isString(min.name, max.base),
  email: key => key.isEmail(),
  password: key => key.isString(min.password, max.base),
};

export const AccountRoutes = (inRouter: Router) => {
  ApiRoute.signUp.addRoute(inRouter, [
    toChains(bodyObject(SignUpValidator)),
    emptyAuthMiddleware,
  ], AccountController.register);

  ApiRoute.changePassword.addRoute(inRouter, [
    toChains(bodyObject(ChangePasswordValidator)),
    authMiddleware,
  ], AccountController.changePassword);
};