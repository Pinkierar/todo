import {HTMLAttributes} from 'react';
import {observer} from 'mobx-react-lite';
import {css} from '@emotion/react';
import {NotificationType} from '#store';
import {getEm} from '#includes/utils';
import {borders, palette} from '#config';

type NotificationPropsMin = {
  children: string,
  type: NotificationType,
};

type NotificationProps =
  Omit<HTMLAttributes<HTMLElement>, keyof NotificationPropsMin>
  & NotificationPropsMin;

const styles = {
  base: (type: NotificationType) => css({
    padding: `${getEm(7)} ${getEm(10)}`,
    width: '100%',
    borderRadius: borders.radius.base,
    borderStyle: 'solid',
    borderWidth: borders.width.small,
    borderColor: palette.gray.hard,
    boxShadow: '0 0 0.3em 0 #0008',
  }, type === NotificationType.warn ? {
    background: palette.yellow.light,
  } : type === NotificationType.error ? {
    background: palette.red.light,
  } : {
    background: palette.white,
  }),
};

export const Notification = observer<NotificationProps>(props => {
  const {
    children,
    type,
    ...otherProps
  } = props;

  return (
    <div css={styles.base(type)} {...otherProps}>
      {children}
    </div>
  );
});