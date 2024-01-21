import {palette} from '#config';
import {css} from '@emotion/react';
import {observer} from 'mobx-react-lite';
import {useNavigate} from 'react-router-dom';

const styles = {
  back: css`
      display: inline;
      color: ${palette.indigo.base};
  `,
};

export const NotFound = observer(() => {
  const navigate = useNavigate();

  return (
    <div>
      Ошибка 404. Страница не найдена.
      <button css={styles.back} onClick={() => navigate(-1)}>
        Назад
      </button>
    </div>
  );
});