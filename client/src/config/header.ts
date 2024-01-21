import {RouteBase} from '#includes/RouteBase';
import {AiOutlineHome} from '@react-icons/all-files/ai/AiOutlineHome';
import {IconType} from 'react-icons';
import {HiLogout} from 'react-icons/hi';
import {Route, routes} from './routes';

type HeaderGroup = {
  left: HeaderItem[],
  right: HeaderItem[],
};

type Header = {
  fontSize: string,
  items: {
    home: HeaderItem,
    empty: HeaderGroup,
    notEmpty: HeaderGroup,
  },
};

export class HeaderItem<
  R extends Route | never = never,
  B extends RouteBase<string, any> = (typeof routes)[R],
> {
  public readonly content: string | IconType;
  public readonly url?: string;
  public readonly subItems: HeaderItem[] = [];

  public constructor(content: string | IconType, to: R, params: Record<B['_typeK'], string | number>);
  public constructor(content: string | IconType, to: B['_typeK'] extends never ? R : never);
  public constructor(content: string | IconType, to: string);
  public constructor(content: string | IconType, subItems: HeaderItem[]);
  public constructor(
    content: string | IconType,
    arg2: HeaderItem[] | string | R,
    params: Record<B['_typeK'], string | number> = {} as any,
  ) {
    this.content = content;
    if (Array.isArray(arg2)) {
      this.subItems = arg2;
    } else if (typeof arg2 === 'string') {
      this.url = arg2;
    } else {
      this.url = (routes[arg2] as any).createUrl(params);
    }
  }
}

const home: HeaderItem = new HeaderItem(AiOutlineHome, Route.Home);
const rightNotEmpty: HeaderItem[] = [
  new HeaderItem(HiLogout, Route.SignOut),
];
const rightEmpty: HeaderItem[] = [
  new HeaderItem('Вход', Route.SignIn),
  new HeaderItem('Регистрация', Route.SignUp),
];
const leftEmpty: HeaderItem[] = [
  new HeaderItem('О программе', Route.About),
];
const leftNotEmpty: HeaderItem[] = [
  new HeaderItem('Задачи', Route.Tasks),
  ...leftEmpty,
];

export const header: Header = {
  fontSize: '17px',
  items: {
    home,
    empty: {
      left: leftEmpty,
      right: rightEmpty,
    },
    notEmpty: {
      left: leftNotEmpty,
      right: rightNotEmpty,
    },
  },
};