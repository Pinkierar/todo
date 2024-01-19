export const checkNever = (never: never): any => {
  console.error('not never', never);
  throw new Error('Non never');
};