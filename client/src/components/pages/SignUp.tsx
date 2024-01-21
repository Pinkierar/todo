import {palette, Route, routes} from '#config';
import {useAxios} from '#hooks';
import {ApiRoute} from '#includes/ApiRoute';
import {getEm} from '#includes/utils';
import {loader, notifications} from '#store';
import {css} from '@emotion/react';
import {observer} from 'mobx-react-lite';
import {FormEventHandler, useCallback, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';

const styles = {
  base: () => css({
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  }),
  input: css`
      width: 100%;
  `,
  already: () => css({
    color: palette.gray.dark,
    fontSize: getEm(14),
    marginTop: getEm(20),
  }),
  alreadyLink: () => css({
    display: 'inline',
    color: palette.blue.base,
  }),
};

export const SignUp = observer(() => {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');

  const apiSignUp = useAxios(ApiRoute.signUp, {
    success: () => {
      notifications.addInfo('Вы успешно зарегистрировались!');
      navigate(routes[Route.SignIn].createUrl());
    },
    fail: error => notifications.addError(error),
  });

  const submitHandler: FormEventHandler = useCallback(async e => {
    e.preventDefault();
    if (apiSignUp.isLoading) return;

    loader.add('SignUp');
    await apiSignUp.request(null, {
      name: name,
      email: email,
      password: password,
    });
    loader.remove('SignUp');
  }, [name, email, password, apiSignUp.isLoading]);

  return (
    <div css={styles.base()}>
      <form onSubmit={submitHandler}>
        <div>
          Зарегистрироваться
        </div>
        <div>
          <input
            placeholder={'Имя'}
            disabled={apiSignUp.isLoading}
            value={name}
            autoComplete={'login'}
            onInput={e => setName(e.currentTarget.value)}
          />
          <input
            css={styles.input}
            placeholder={'Email'}
            type={'email'}
            autoComplete={'email'}
            value={email}
            onInput={e => setEmail(e.currentTarget.value)}
          />
          <input
            css={styles.input}
            placeholder={'Пароль'}
            type={'password'}
            autoComplete={'new-password'}
            value={password}
            onInput={e => setPassword(e.currentTarget.value)}
          />
          <input type="submit"/>
        </div>
      </form>
      <div css={styles.already()}>
        Уже есть аккаунт?
        <Link css={styles.alreadyLink()} to={routes[Route.SignIn].createUrl()}>
          Войти
        </Link>
      </div>
    </div>
  );
});