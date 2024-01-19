export const Inline = {
  tryCatch: <T, E = unknown>(
    tryCallback: () => T,
    catchCallback: (e: E) => T,
  ): T => {
    try {
      return tryCallback();
    } catch (e) {
      return catchCallback(e as E);
    }
  },
  ifElse: <T>(
    condition: boolean,
    trueCallback: () => T,
    falseCallback: () => T,
  ): T => {
    return condition ? trueCallback() : falseCallback();
  },
  switchCase: <T, A = any>(
    target: A,
    cases: { value: A, callback: () => T }[],
    defaultCase: () => T,
  ): T => {
    return (cases.find(({value}) => value === target)?.callback ?? defaultCase)();
  },
};