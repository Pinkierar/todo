export class DateTimeFormat {
  public date: Date;

  public constructor(value: number | string | Date) {
    this.date = new Date(value);
  }

  // Day
  public get d(): string {
    return String(this.date.getDate());
  }

  // Day
  public get dd(): string {
    const d = this.d;

    return d.length === 1 ? `0${d}` : d;
  }

  // Month
  public get m(): string {
    return String((this.date.getMonth() + 1));
  }

  // Month
  public get mm(): string {
    const m = this.m;

    return m.length === 1 ? `0${m}` : m;
  }

  // Year
  public get yyyy(): string {
    return String(this.date.getFullYear());
  }

  // Year
  public get yy(): string {
    return this.yyyy.slice(1).slice(1);
  }

  // Hours
  public get h(): string {
    return String(this.date.getHours());
  }

  // Hours
  public get hh(): string {
    const h = this.h;

    return h.length === 1 ? `0${h}` : h;
  }

  // Minute
  public get i(): string {
    return String(this.date.getMinutes());
  }

  // Minute
  public get ii(): string {
    const i = this.i;

    return i.length === 1 ? `0${i}` : i;
  }

  // Seconds
  public get s(): string {
    return String(this.date.getSeconds());
  }

  // Seconds
  public get ss(): string {
    const s = this.s;

    return s.length === 1 ? `0${s}` : s;
  }

  public getRuDate(): string {
    return `${this.dd}.${this.mm}.${this.yyyy}`;
  }

  public getTime(): string {
    return `${this.hh}:${this.ii}:${this.ss}`;
  }

  public static toRuDate(value: number | string | Date): string
  public static toRuDate(date: DateTimeFormat): string
  public static toRuDate(arg1: number | string | Date | DateTimeFormat): string {
    if (arg1 instanceof DateTimeFormat) return arg1.getRuDate();

    return new DateTimeFormat(arg1).getRuDate();
  }

  public getTimeFileName(): string {
    return `${this.hh}-${this.ii}-${this.ss}`;
  }

  public getDateFileName(): string {
    return `${this.yyyy}-${this.mm}-${this.dd}`;
  }

  public getDateTimeFileName(): string {
    return `${this.getDateFileName()}_${this.getTimeFileName()}`;
  }

  public static toDateTimeFileName(value: number | string | Date): string
  public static toDateTimeFileName(date: DateTimeFormat): string
  public static toDateTimeFileName(arg1: number | string | Date | DateTimeFormat): string {
    if (arg1 instanceof DateTimeFormat) return arg1.getDateTimeFileName();

    return new DateTimeFormat(arg1).getDateTimeFileName();
  }

  public static toTimeFileName(value: number | string | Date): string
  public static toTimeFileName(date: DateTimeFormat): string
  public static toTimeFileName(arg1: number | string | Date | DateTimeFormat): string {
    if (arg1 instanceof DateTimeFormat) return arg1.getTimeFileName();

    return new DateTimeFormat(arg1).getTimeFileName();
  }

  public static toDateFileName(value: number | string | Date): string
  public static toDateFileName(date: DateTimeFormat): string
  public static toDateFileName(arg1: number | string | Date | DateTimeFormat): string {
    if (arg1 instanceof DateTimeFormat) return arg1.getDateFileName();

    return new DateTimeFormat(arg1).getDateFileName();
  }

  public static toTime(value: number | string | Date): string
  public static toTime(date: DateTimeFormat): string
  public static toTime(arg1: number | string | Date | DateTimeFormat): string {
    if (arg1 instanceof DateTimeFormat) return arg1.getTime();

    return new DateTimeFormat(arg1).getTime();
  }
}
