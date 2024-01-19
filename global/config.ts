export const config = (() => {
  const lengths = (() => {
    const max = {
      base: 255,
      tiny: 65_535,
      medium: 16_777_215,
      long: 4_294_967_295,
    } as const;

    const min = {
      name: 3,
      password: 6,
    } as const;

    return {max, min} as const;
  })();

  const urls = {
    domain: 'https://school.expert-cok.ru',
  } as const;

  const client = {
    port: '5000',
  } as const;

  const server = {
    port: '3000',
  } as const;

  return {lengths, urls, client, server} as const;
})();