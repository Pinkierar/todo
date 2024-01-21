import {observer} from 'mobx-react-lite';
import {loader, notifications} from '#store';
import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAxios} from '#hooks';
import {ApiRoute} from '#includes/ApiRoute';
import {Route, routes} from '#config';
import {axios} from '#includes/axios';

export const SignOut = observer(() => {
  const navigate = useNavigate();

  const apiSignOut = useAxios(ApiRoute.signOut, {
    success: () => {
      axios.removeAuthorization();
      navigate(routes[Route.SignIn].createUrl());
      loader.remove('SignOut');
    },
    fail: error => {
      notifications.addError(error);
      navigate(-1);
      loader.remove('SignOut');
    },
  });

  useEffect(() => {
    loader.add('SignOut');
    apiSignOut.request();
  }, []);

  return (
    <div/>
  );
});