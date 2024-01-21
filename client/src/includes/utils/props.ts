import type {HTMLAttributes} from 'react';

export type OmitChildren<T> = Omit<T, 'children'>;

export type IncludeHTMLProps<
  Props extends {},
  Element extends HTMLElement = HTMLElement,
> = Omit<HTMLAttributes<Element>, keyof Props> & Props;