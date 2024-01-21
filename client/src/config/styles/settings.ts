// noinspection ES6PreferShortImport

import {getEm} from '#includes/utils';

export const borders = {
  radius: {
    none: '0',
    min: getEm(2),
    small: getEm(4),
    base: getEm(6),
    big: getEm(9),
    lage: getEm(13),
    max: '9999px',
  },
  width: {
    small: getEm(1),
    base: getEm(2),
  },
} as const;

// export type BorderRadius = keyof typeof borders.radius;
// export type BorderWidth = keyof typeof borders.width;