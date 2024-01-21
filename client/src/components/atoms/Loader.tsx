import {css, keyframes} from '@emotion/react';
import {memo, ReactElement} from 'react';

type LoaderProps = {
  children?: ReactElement,
  isLoading: boolean,
};

const scale = 250;

const bgSize =  (isLoading: boolean) => isLoading
  ? `min(${scale}vw, ${scale}vh)`
  : `calc(min(${scale}vw, ${scale}vh) * 2)`

const animation = {
  base: keyframes`
      0% {
          background-position-x: calc(min(${scale}vw, ${scale}vh) * 2);
      }
      100% {
          background-position-x: min(${scale}vw, ${scale}vh);
      }
  `,
};

const styles = {
  base: (isLoading: boolean) => css`
      position: absolute;
      display: none;

      & + * {
          position: relative;
          pointer-events: ${isLoading ? 'none' : 'all'};
          user-select: ${isLoading ? 'none' : 'initial'};
          overflow: hidden;

          &:before {
              content: "";
              z-index: 1;
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              pointer-events: none;
              background-image: linear-gradient(
                      135deg,
                      #7f9aab33,
                      #7f9aab,
                      #7f9aab33,
                      #7f9aab,
                      #7f9aab33
              );
              background-size: ${`${bgSize(isLoading)} `.repeat(2)};
              transition: 500ms ease-out;
              animation: ${animation.base} 1s linear infinite;
              opacity: ${isLoading ? 0.5 : 0};
          }
      }
  `,
};

export const Loader = memo<LoaderProps>(props => {
  const {
    children,
    isLoading,
  } = props;

  return (
    <>
      <div css={styles.base(isLoading)}/>
      {children}
    </>
  );
});