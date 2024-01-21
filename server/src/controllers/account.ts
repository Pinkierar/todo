import {UserService} from '#entities/User';
import {RequestError} from '#errors';
import {UserArgs} from '#global';
import {ApiRoute, createController} from '#includes/ApiRoute';
import {Validator} from '#includes/validator';
import {AccountService} from '#services';

export const AccountController = new (class AccountController {
  public readonly register = createController(ApiRoute.signUp, async req => {
    const args = this.normalizeArgs(req.body);

    return {
      data: await UserService.create(args),
    };
  });

  public readonly changePassword = createController(ApiRoute.changePassword, async req => {
    if (!req.jwt.user) throw new RequestError.unauthorized(
      `${this.constructor.name}.${this.changePassword.name}`,
    );

    const userId = req.jwt.user.id;
    const args = req.body;

    await AccountService.changePassword(userId, args);
  });

  // private:

  private normalizeArgs<A extends Partial<UserArgs>>(args: A): A {
    return {
      ...args,
      name: args.name && Validator.removeSpaces(args.name),
    };
  }
})();