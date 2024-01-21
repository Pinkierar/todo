import {getEm} from '#includes/utils';
import {loader} from '#store';
import {css, keyframes} from '@emotion/react';
import {observer} from 'mobx-react-lite';

const anumation = {
  outer: keyframes`
      0% {
          transform: rotate(0deg);
      }
      100% {
          transform: rotate(360deg);
      }
  `,
  inner: keyframes`
      0% {
          transform: rotate(0deg);
      }
      100% {
          transform: rotate(-360deg);
      }
  `,
};

const styles = {
  base: (isVisible: boolean) => css`
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 1;
      opacity: ${isVisible ? 1 : 0};
      pointer-events: ${isVisible ? 'all' : 'none'};
      user-select: none;
      display: grid;
      align-content: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      background-color: #548cb8;
      transition: opacity ease-in;
      transition-duration: ${isVisible ? '.05s' : '.5s'};
  `,
  box: css`
      position: relative;
      width: ${getEm(120)};
      height: ${getEm(120)};
  `,
  circle: (isVisible: boolean, isOuter: boolean) => css`
      position: absolute;
      display: block;
      border-radius: 100%;
      border: ${getEm(7)} solid;
      animation: linear infinite;
      animation-duration: ${isVisible ? '1s' : '.3s'};
      top: ${isOuter ? '0' : `calc(50% - ${getEm(40)})`};
      left: ${isOuter ? '0' : `calc(50% - ${getEm(40)})`};
      width: ${isOuter ? '100%' : getEm(80)};
      height: ${isOuter ? '100%' : getEm(80)};
      animation-name: ${isOuter ? anumation.outer : anumation.inner};
      border-color: ${isOuter ? '#3055ee' : '#61c5dd'};
      border-${isOuter ? 'left' : 'top'}-color: transparent;
  `,
};

export const Preloader = observer(() => {
  return (
    <div css={styles.base(loader.displayed)}>
      <div css={styles.box}>
        <span css={styles.circle(loader.displayed, true)}/>
        <span css={styles.circle(loader.displayed, false)}/>
      </div>
    </div>
  );
});
