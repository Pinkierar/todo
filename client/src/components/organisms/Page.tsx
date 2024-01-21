import {Header} from '#components/organisms/Header.tsx';
import {Notifications} from '#components/organisms/Notifications';
import {Home, NotFound, SignIn, SignOut, SignUp} from '#components/pages';
import {Route as ClientRoute, routes as clientRoutes} from '#config';
import {css} from '@emotion/react';
import {observer} from 'mobx-react-lite';
import {FunctionComponent, useMemo} from 'react';
import {Route, Routes} from 'react-router-dom';

const styles = {
  base: css`
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background-repeat: repeat;
      background-size: min(max(22vw, 22vh), 500px);
  `,
};

const routesSettings: Record<ClientRoute, FunctionComponent> = {
  [ClientRoute.Home]: Home,

  [ClientRoute.SignIn]: SignIn,
  [ClientRoute.SignUp]: SignUp,
  [ClientRoute.SignOut]: SignOut,

  [ClientRoute.Tasks]: NotFound,
  [ClientRoute.Task]: NotFound,

  [ClientRoute.About]: NotFound,

  [ClientRoute.NotFound]: NotFound,
};

export const Page = observer(() => {
  const routes = useMemo(() => (
    <Routes>
      {Object.entries(routesSettings).map(([id, Component]) => (
        <Route
          key={id}
          path={String(clientRoutes[Number(id) as ClientRoute])}
          element={<Component/>}
        />
      ))}
    </Routes>
  ), [routesSettings]);

  return (
    <div css={styles.base}>
      <Header/>
      {routes}
      <Notifications/>
    </div>
  );
});