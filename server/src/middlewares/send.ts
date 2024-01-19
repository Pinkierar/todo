import {FileSystemService} from '#services';
import {Middleware} from '#middlewares';

export const sendMiddleware: Middleware<void> = (_req, res) => {
  res.cookies.add.forEach(([name, value, options]) => res.cookie(name, value, options));
  res.cookies.remove.forEach(([name, options]) => res.clearCookie(name, options));

  if (res.file) {
    res.set(
      'Content-Disposition',
      `attachment; filename="${FileSystemService.getFileName(res.file).substring(1)}"`,
    );
    res.status(res.code).sendFile(res.file);
  } else {
    res.status(res.code).json(res.data);
  }
};