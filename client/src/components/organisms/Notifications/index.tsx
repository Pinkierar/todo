import {observer} from 'mobx-react-lite';
import {css} from '@emotion/react';
import {notifications} from '#store';
import {Notification} from './Notification';
import {getEm} from '#includes/utils';
import {palette} from '#config';

const styles = {
  base: () => css({
    position: 'fixed',
    top: 0,
    right: 0,
    width: getEm(400),
    padding: getEm(5),
    zIndex: 10000,
    color: palette.black,
    fontWeight: 'bold',
  }),
};

export const Notifications = observer(() => {
  return (
    notifications.items.length === 0 ? <></> : (
      <div css={styles.base()}>
        {notifications.items.map(notification => (
          <Notification key={notification.id} type={notification.type}>
            {notification.content}
          </Notification>
        ))}
      </div>
    )
  );
});