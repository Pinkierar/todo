import {AccountService} from '#services';
import {ApiRoute, createController} from '#includes/ApiRoute';

export const AuthController = {
  signIn: createController(ApiRoute.signIn, async req => {
    const args = req.body;

    const {tokens, user} = await AccountService.login(args);

    req.jwt.new(user, tokens.refresh, tokens.access);
  }),

  getToken: createController(ApiRoute.getToken),

  signOut: createController(ApiRoute.signOut, async req => {
    req.jwt.remove();
  }),

  changePassword: createController(ApiRoute.changePassword, async req => {
    const userId = Number(req.jwt.user?.id);
    const args = req.body;

    await AccountService.changePassword(userId, args);
  }),
} as const;