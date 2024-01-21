import {observer} from 'mobx-react-lite';
import {HTMLAttributes} from 'react';

type HeaderPropsMin = {
  children?: never,
};

type HeaderProps =
  Omit<HTMLAttributes<HTMLElement>, keyof HeaderPropsMin>
  & HeaderPropsMin;

export const Header = observer<HeaderProps>(props => {
  const {
    className,
    ...otherProps
  } = props;

  return (
    <div className={className} {...otherProps}>

    </div>
  );
});