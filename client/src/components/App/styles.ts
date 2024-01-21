import {getEm} from '#includes/utils';
import {css} from '@emotion/react';

export const styles = {
  global: css`
      *, *::before, *::after {
          box-sizing: border-box;
          padding: 0;
          margin: 0;
          border: none;
          text-decoration: none;
          list-style: none;
          background: none;
          font-size: ${getEm(16)};
          line-height: 1.5;
          font-family: inherit;
          font-weight: inherit;
          color: inherit;
          word-spacing: inherit;
          letter-spacing: inherit;
          text-rendering: inherit;
          transition: inherit;
          word-break: break-word;
      }

      html, body, #root {
          display: grid;
          width: 100%;
          min-height: 100%;
          scroll-behavior: smooth;
          font-family: sans-serif;
          font-weight: 400;
          word-spacing: ${getEm(0.5)};
          letter-spacing: ${getEm(0.5)};
          text-rendering: geometricPrecision;
          transition: color 200ms ease-out, background-color 200ms ease-out;
          background-color: #d0d6dc;
          color: #111111;
      }

      textarea {
          display: block;
      }
  `,
};