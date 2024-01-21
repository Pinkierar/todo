// noinspection ES6PreferShortImport

import {config} from '#global';

const ipSubstrings = window.location.hostname.split('.');

const isLocalhost = window.location.hostname === 'localhost';
const isLocalIp = ipSubstrings[0] === '192' && ipSubstrings[1] === '168';

export const isProduction = !isLocalhost && !isLocalIp;

export const urls = (() => {
  const frontend = window.location.origin;
  const short = window.location.host;
  const backend = isProduction
    ? config.urls.domain
    : `http://${window.location.hostname}:${config.server.port}`;

  return {short, frontend, backend} as const
})();