export const aHasB = <T>(a: T[], b: T[]): boolean => {
  for (let a_ of a)
    if (b.includes(a_)) return true;

  return false;
};

export const deleteUndefinedFields = (object: any): any => {
  for (let key in object)
    if (object[key] === undefined) delete object[key];

  return object;
};