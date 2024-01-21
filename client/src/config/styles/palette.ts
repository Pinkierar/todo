export type Brightness = 'white' | 'light' | 'soft' | 'base' | 'hard' | 'dark' | 'black';

type Palette = { readonly [key in Brightness]: string };

const white = '#fcfffc';
const black = '#211724';

const pink: Palette = {
  white: '#ffebf1',
  light: '#ffb8cf',
  soft: '#ea759c',
  base: '#ea3974',
  hard: '#b5305d',
  dark: '#7e1b3c',
  black: '#441d2a',
};

const purple: Palette = {
  white: '#fcebff',
  light: '#f4b8ff',
  soft: '#d975ea',
  base: '#d039ea',
  hard: '#a130b5',
  dark: '#6f1b7e',
  black: '#3e1d44',
};

const deepPurple: Palette = {
  white: '#f2ebff',
  light: '#d2b8ff',
  soft: '#a075ea',
  base: '#7a39ea',
  hard: '#6130b5',
  dark: '#3f1b7e',
  black: '#2b1d44',
};

const indigo: Palette = {
  white: '#ebeeff',
  light: '#b8c2ff',
  soft: '#7587ea',
  base: '#3953ea',
  hard: '#3044b5',
  dark: '#1b2a7e',
  black: '#1d2344',
};

const blue: Palette = {
  white: '#ebf6ff',
  light: '#b8dfff',
  soft: '#75b6ea',
  base: '#399aea',
  hard: '#3079b5',
  dark: '#1b517e',
  black: '#1d3244',
};

const lightBlue: Palette = {
  white: '#ebfdff',
  light: '#b8f7ff',
  soft: '#75ddea',
  base: '#39d5ea',
  hard: '#30a6b5',
  dark: '#1b737e',
  black: '#1d4044',
};

const cyan: Palette = {
  white: '#ebfffd',
  light: '#b8fff8',
  soft: '#75eadf',
  base: '#39ead8',
  hard: '#30b5a8',
  dark: '#1b7e74',
  black: '#1d4440',
};

const green: Palette = {
  white: '#ebffeb',
  light: '#b8ffb8',
  soft: '#75ea75',
  base: '#39ea39',
  hard: '#30b530',
  dark: '#1b7e1b',
  black: '#1d441d',
};

const lightGreen: Palette = {
  white: '#f5ffeb',
  light: '#deffb8',
  soft: '#b4ea75',
  base: '#97ea39',
  hard: '#77b530',
  dark: '#507e1b',
  black: '#32441d',
};

const yellow: Palette = {
  white: '#fffceb',
  light: '#fff3b8',
  soft: '#ead775',
  base: '#eacd39',
  hard: '#b59f30',
  dark: '#7e6e1b',
  black: '#443e1d',
};

const orange: Palette = {
  white: '#fff5eb',
  light: '#ffdbb8',
  soft: '#eab075',
  base: '#ea9139',
  hard: '#b57330',
  dark: '#7e4d1b',
  black: '#44301d',
};

const red: Palette = {
  white: '#ffebeb',
  light: '#ffb8b8',
  soft: '#ea7575',
  base: '#ea3939',
  hard: '#b53030',
  dark: '#7e1b1b',
  black: '#441d1d',
};

const brown: Palette = {
  white: '#f0d7ce',
  light: '#bcaaa4',
  soft: '#8d6e63',
  base: '#6d4c41',
  hard: '#4e342e',
  dark: '#3e2723',
  black: '#28120e',
};

const gray: Palette = {
  white: '#ebebeb',
  light: '#e0e0e0',
  soft: '#bdbdbd',
  base: '#9e9e9e',
  hard: '#787878',
  dark: '#4a4a4a',
  black: '#212121',
};

const lightGray: Palette = {
  white: '#fcfffc',
  light: '#eff2ef',
  soft: '#e2e5e2',
  base: '#d5d7d5',
  hard: '#c9cac9',
  dark: '#bcbdbc',
  black: '#afb0af',
};

const blueGrey: Palette = {
  white: '#d9e5ea',
  light: '#b0bec5',
  soft: '#90a4ae',
  base: '#607d8b',
  hard: '#37474f',
  dark: '#263238',
  black: '#0f1a1d',
};

const darkRevers: Palette = {
  white: '#211724',
  light: '#211724',
  soft: '#211724',
  base: '#211724',
  hard: '#211724',
  dark: '#605B61',
  black: '#605B61',
};

export const palette = {
  white,
  black,
  pink,
  purple,
  deepPurple,
  indigo,
  blue,
  lightBlue,
  cyan,
  green,
  lightGreen,
  yellow,
  orange,
  red,
  brown,
  gray,
  lightGray,
  blueGrey,
  darkRevers,
} as const;

export type ColorName = keyof Omit<typeof palette, 'white' | 'black'>;
export const colorNames: ColorName[] = Object.keys(palette) as ColorName[];
export const isColorName = (color: string): color is ColorName => {
  if (color === 'white') return false;
  if (color === 'black') return false;
  if (color === 'lightGray') return false;
  if (color === 'blueGrey') return false;
  if (color === 'darkRevers ') return false;

  return (colorNames as string[]).includes(color);
};