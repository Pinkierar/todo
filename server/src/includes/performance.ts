import {performance} from 'perf_hooks';

export class Performance {
  private static readonly _tests: Performance[] = [];

  public static start(name: Performance['name']): void {
    const test = Performance.find(name);
    if (test) return test.reload();

    Performance._tests.push(new Performance(name));
  }

  public static finish(name: Performance['name']): number {
    return Performance.find(name)?.getDifference() ?? Infinity;
  }

  private static find(name: Performance['name']): Performance | undefined {
    return Performance._tests.find(performance => performance.name === name);
  }

  private readonly name: string;
  private timestamp!: number;

  private constructor(name: Performance['name']) {
    this.name = name;
    this.reload();
  }

  private reload(): void {
    this.timestamp = performance.now();
  }

  private getDifference(): number {
    return Math.round((performance.now() - this.timestamp) * 1000) / 1000;
  }
}