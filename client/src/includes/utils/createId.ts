let lastId = 0;

export const createId = (prefix: string = '') => `${prefix}${++lastId}`;
