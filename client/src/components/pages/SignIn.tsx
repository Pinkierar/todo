import {palette, Route, routes} from '#config';
import {useAxios} from '#hooks';
import {ApiRoute} from '#includes/ApiRoute';
import {getEm} from '#includes/utils';
import {loader, notifications} from '#store';
import {css} from '@emotion/react';
import {observer} from 'mobx-react-lite';
import {FormEventHandler, useCallback, useRef} from 'react';
import {Link, useNavigate} from 'react-router-dom';

const styles = {
  base: css`
      flex-grow: 1;
      align-items: center;
      justify-content: flex-start;
  `,
  input: () => css`
      width: 100%;
  `,
  under: () => css`
      font-size: ${getEm(14)};
      flex-wrap: wrap;
      white-space: nowrap;
  `,
  already: () => css`
      color: ${palette.gray.dark};
      font-size: ${getEm(14)};
      margin-top: ${getEm(20)};
  `,
  alreadyLink: () => css`
      display: inline;
      color: ${palette.blue.base};
  `,
};

export const SignIn = observer(() => {
  const navigate = useNavigate();

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const apiSignIn = useAxios(ApiRoute.signIn, {
    success: () => navigate(routes[Route.Home].createUrl()),
    fail: error => notifications.addError(error),
  });

  const submitHandler: FormEventHandler = useCallback(async e => {
    e.preventDefault();
    if (apiSignIn.isLoading) return;
    if (!emailRef.current || !passwordRef.current) return;

    loader.add('SignIn');
    await apiSignIn.request(null, {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    });
    loader.remove('SignIn');
  }, [apiSignIn.isLoading, emailRef.current, passwordRef.current]);

  return (
    <div css={styles.base}>
      <form onSubmit={submitHandler}>
        <div>
          Войти
        </div>
        <div>
          <input
            css={styles.input()}
            placeholder={'Email'}
            type={'email'}
            ref={emailRef}
            disabled={apiSignIn.isLoading}
          />
          <input
            css={styles.input()}
            placeholder={'Пароль'}
            type={'password'}
            ref={passwordRef}
            disabled={apiSignIn.isLoading}
          />
        </div>
        <input
          type={'submit'}
          disabled={apiSignIn.isLoading}
        />
      </form>
      <div css={styles.already()}>
        Ещё нет учётной записи?
        <Link css={styles.alreadyLink()} to={routes[Route.SignUp].createUrl()}>
          Зарегистрироваться
        </Link>
      </div>
    </div>
  );
});