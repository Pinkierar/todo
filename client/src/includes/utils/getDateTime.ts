const normalize = (str: string) => str.length === 1 ? `0${str}` : str;

type DateTimeValue = number | string | Date;

type DateTimeComponents = {
  d: string,
  dd: string,
  m: string,
  mm: string,
  yy: string,
  yyyy: string,
  h: string,
  hh: string,
  i: string,
  ii: string,
  s: string,
  ss: string,
};

export const getDateTime = (value: DateTimeValue): DateTimeComponents => {
  const date_ = new Date(value);

  const d = date_.getDate().toString();
  const m = (date_.getMonth() + 1).toString();
  const yyyy = date_.getFullYear().toString();

  const h = date_.getHours().toString();
  const i = date_.getMinutes().toString();
  const s = date_.getSeconds().toString();

  return {
    d,
    dd: normalize(d),
    m,
    mm: normalize(m),
    yy: yyyy.slice(2),
    yyyy,

    h,
    hh: normalize(h),
    i,
    ii: normalize(i),
    s,
    ss: normalize(s),
  };
};