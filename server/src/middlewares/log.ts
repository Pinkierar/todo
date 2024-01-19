import {clear, colored, ConsoleStyle, formatData, line} from '#includes/console';
import {config} from '#config';
import {GoodCode} from '#global';
import {Request, Response} from 'express';
import {Middleware} from '#middlewares';

const logItem = (key: string, ...values: any) =>
  console.log(colored(`${key}:`, undefined, [ConsoleStyle.Bold]), ...values);

const logRequest = (req: Request) => {
  line('Request', [255, 255, 70], 70);

  if (config.logs.isBriefly) {
    if (req.body) {
      const length = typeof req.body === 'string' ? req.body.length : JSON.stringify(req.body).length;
      logItem('Body length', length);
    }
    if (req.files) {
      const count = Object.values(req.files).length;
      logItem('Files count', count);
    }
  } else {
    req.init_cookies && logItem('Cookies', formatData(req.init_cookies));
    req.init_authorization && logItem('Authorization', req.init_authorization);
    logItem('Params', formatData(req.params));
    req.body && logItem('Body', formatData(req.body));
    req.files && Object.values(req.files).length && logItem('Files', req.files);
  }
};

const logResponse = (res: Response) => {
  line('Response', res.code === GoodCode.success ? [70, 255, 70] : [255, 70, 70], 70);

  if (config.logs.isBriefly) {
    if (res.file) {
      logItem('File', res.file);
    } else {
      logItem('Data length', JSON.stringify(res.data).length);
    }
    res.cookies.add.length && logItem('Cookies add count', res.cookies.add.length);
    res.cookies.remove.length && logItem('Cookies remove count', res.cookies.remove.length);
  } else {
    if (res.file) {
      logItem('File', res.file);
    } else {
      logItem('Data', formatData(res.data));
    }
    res.cookies.add.length && logItem('Cookies add', formatData(res.cookies.add.map(args => args[0])));
    res.cookies.remove.length && logItem(
      'Cookies remove',
      formatData(res.cookies.remove.map(args => args[0])),
    );
  }
};

export const logMiddleware: Middleware<void> = (req, res) => {
  if (config.logs.onlyPaths) {
    console.log(colored(
      [req.method, req.path, '->', res.code, res.data.message, `(${res.performanceTime}ms)`]
        .filter(value => Boolean(value))
        .join(' '),
      res.code === GoodCode.success
        ? [0, 255, 0]
        : [255, 0, 0],
    ));

    return;
  }

  clear(1);

  line(`${req.method} ${req.path} -> ${res.code} (${res.performanceTime}ms`, [255, 255, 255]);
  clear(1);

  logRequest(req);
  clear(1);

  logResponse(res);
  clear(1);

  line(null, [255, 255, 255]);
  clear(1);
};