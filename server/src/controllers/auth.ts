import {ApiRoute, createController} from '#includes/ApiRoute';
import {AccountService} from '#services';

export const AuthController = new (class AuthController {
  public readonly signIn = createController(ApiRoute.signIn, async req => {
    const args = req.body;

    const {tokens, user} = await AccountService.login(args);

    req.jwt.new(user, tokens.refresh, tokens.access);
  });

  public readonly getToken = createController(ApiRoute.getToken);

  public readonly signOut = createController(ApiRoute.signOut, async req => {
    req.jwt.remove();
  });
})();