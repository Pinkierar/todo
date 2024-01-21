import bcrypt from 'bcrypt';
import {ChangePasswordArgs, LoginArgs, TokensData} from '#global';
import {TokenService} from '#services';
import {User, UserTransfer} from '#entities/User';
import {RequestError} from '#errors';
import {UserJwtTransfer} from '#transfers';

class Service {
  public login(args: LoginArgs): Promise<TokensData>
  public async login(args: LoginArgs): Promise<TokensData> {
    const user = await User.findOne({
      where: {email: args.email},
      rejectOnEmpty: new RequestError.badRequest(
        `${this.constructor.name}.${this.login.name}`,
        'Неверный Email',
      ),
    });

    const passwordsEquals = await bcrypt.compare(args.password, user.password);
    if (!passwordsEquals) throw new RequestError.badRequest(
      `${this.constructor.name}.${this.login.name}`,
      'Неверный пароль',
    );

    const userData = await UserTransfer.get(user);
    const userJwtData = await UserJwtTransfer.get(userData);
    const tokens = TokenService.newPair(userJwtData);

    return {
      tokens,
      user: userData,
    };
  }

  public changePassword(id: User['id'], args: ChangePasswordArgs): Promise<void>
  public async changePassword(id: User['id'], args: ChangePasswordArgs): Promise<void> {
    const user = await User.findByPk(id);
    if (!user) throw new RequestError.badRequest(
      `${this.constructor.name}.${this.changePassword.name}`,
      `Пользователь с идентификатором ${id} не найден`,
    );

    const passwordsEquals = await bcrypt.compare(args.oldPassword, user.password);
    if (!passwordsEquals) throw new RequestError.badRequest(
      `${this.constructor.name}.${this.changePassword.name}`,
      'Неверный старый пароль',
    );

    user.password = await bcrypt.hash(args.newPassword, 3);

    await user.save();
  }
}

export const AccountService = new Service();