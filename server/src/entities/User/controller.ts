import {UserService} from '#entities/User';
import {UserArgs} from '#global';
import {ApiRoute, createController} from '#includes/ApiRoute';
import {Validator} from '#includes/validator';

export const UserController = new (class UserController {
  public readonly register = createController(ApiRoute.signUp, async req => {
    const args = this.normalizeArgs(req.body);

    return {
      data: await UserService.create(args),
    };
  });

  // private:

  private normalizeArgs<A extends Partial<UserArgs>>(args: A): A {
    return {
      ...args,
      lastName: args.lastName && Validator.removeSpaces(args.lastName),
      firstName: args.firstName && Validator.removeSpaces(args.firstName),
      patronymic: args.patronymic && Validator.removeSpaces(args.patronymic),
    };
  }
})();