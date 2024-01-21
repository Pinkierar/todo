export const useTrotting = (callback: () => any, duration: number) => {
  let timeout: number;

  return () => {
    window.clearTimeout(timeout);
    window.setTimeout(callback, duration);
  };
};