import {config} from '#config';

export enum ConsoleStyle {
  Bold = '1',
  Transparent = '2',
  Underline = '4',
  Reverse = '7',
  Hidden = '8'
}

type SingleColor = [number, number, number];
type Color = SingleColor | [number, number, number, number, number, number];
const out = (text: string, options: string) => `\x1b[${options}m${text}\x1b[0m`;
const validate = (v: number) => {
  if (0 <= v && v < 256) return Math.floor(v);

  throw new Error(`includes.console.colored: Bad color value ${v}`);
};
export const colored = (text: string, color: [] | Color = [], styles?: ConsoleStyle[]) => {
  const [fr, fg, fb, br, bg, bb] = color;
  const s = styles ? styles.join(';') : '';

  if (fr === undefined || fg === undefined || fb === undefined) return out(text, `${s}`);

  const f = `38;2;${validate(fr)};${validate(fg)};${validate(fb)}`;

  if (br === undefined || bg === undefined || bb === undefined) return out(text, `${s};${f}`);

  const b = `48;2;${validate(br)};${validate(bg)};${validate(bb)}`;

  return out(text, `${s};${f};${b}`);
};

export const line = (title: string | null | undefined, color: SingleColor, length: number = 140) => {
  const text = title
    ? (`== ${title} `).padEnd(length, '=')
    : ('=').repeat(length);

  console.log(colored(text, color, [ConsoleStyle.Bold]));
};

export const clear = (enters: number) => {
  for (let i = 0; i < enters; i++) console.log();
};

export const stringify = (data: any) => JSON.stringify(data, undefined, '   ');

export const formatData = (data: any): string => stringify(data)
  .replace(/(\r\n)|(\n\r)/g, '\n')
  .replace(/,\n/g, '&')
  .replace(/$/g, '&')
  .replace(/([^\[{])\n/g, '$1&')
  .replace(/\[/g, '%O%')
  .replace(/]/g, '%C%')
  .replace(/{/g, '%o%')
  .replace(/}/g, '%c%')
  .replace(/"([A-z0-9]+)":/g, `${colored('$1', [255, 255, 255], [ConsoleStyle.Bold])}:`)
  .replace(/: (?!(%O%)|(%o%))([^&]*)&/g, `: ${colored('$3', [80, 200, 0])}&`)
  .replace(/ {3}/g, `${colored('|', [80, 80, 80])}  `)
  .replace(/(%O%)/g, colored('[', [0, 150, 200]))
  .replace(/(%C%)/g, colored(']', [0, 150, 200]))
  .replace(/(%o%)/g, colored('{', [180, 120, 0]))
  .replace(/(%c%)/g, colored('}', [180, 120, 0]))
  .replace(/(&)/g, ',\n')
  .replace(/"/g, '\'')
  .replace(/\n$/g, '')
;

export const logUrl = () => {
  clear(5);
  line('Сервер запущен', [255, 255, 255]);
  console.log(colored('Url:', [], [ConsoleStyle.Bold]), `${config.server.url}/api`);
};