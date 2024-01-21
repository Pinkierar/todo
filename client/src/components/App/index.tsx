import {Preloader} from '#components/organisms';
import {loader} from '#store';
import {observer} from 'mobx-react-lite';
import {useEffect} from 'react';

export const App = observer(() => {
  useEffect(() => {
    loader.remove('load');
  }, []);

  return (
    <>
      <div>
        App
      </div>
      <Preloader/>
    </>
  );
});