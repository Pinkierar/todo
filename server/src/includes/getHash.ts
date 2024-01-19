export function getHash(str: string): number {
  let hash = 0;

  for (let i = 0; i < str.length; i++) hash = Math.abs(
    ((hash << 5) - hash) + str.charCodeAt(i));

  return hash;
}