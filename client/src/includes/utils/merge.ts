export const merge = (first: any, second: any): any => {
  if (typeof first !== typeof second) throw new Error('Types vary');

  if (typeof first === 'object' && typeof second === 'object') {
    if (Array.isArray(first) && Array.isArray(second)) return second;

    const out: any = {};

    const keys: string[] = [];
    const all_keys: string[] = [...Object.keys(first), ...Object.keys(second)];
    all_keys.forEach(key => !keys.includes(key) && keys.push(key));
    keys.forEach(key => {
      out[key] = first[key]
        ? second[key]
          ? merge(first[key], second[key])
          : first[key]
        : second[key];
    });

    return out;
  } else {
    return second;
  }
};
