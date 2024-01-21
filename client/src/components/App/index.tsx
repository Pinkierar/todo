import {Page, Preloader} from '#components/organisms';
import {loader} from '#store';
import {observer} from 'mobx-react-lite';
import {useEffect} from 'react';
import {BrowserRouter} from 'react-router-dom';

export const App = observer(() => {
  useEffect(() => {
    loader.remove('load');
  }, []);

  return (
    <BrowserRouter>
      <Page/>
      <Preloader/>
    </BrowserRouter>
  );
});