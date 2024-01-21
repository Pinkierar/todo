export class SuperError extends Error {
  public readonly sender: string;

  public constructor(
    sender: string,
    message: string,
    log: boolean = true,
  ) {
    super(message);
    this.sender = sender;

    log && this.log();
  }

  public log(end: boolean = true) {
    console.group(`${this.sender}:\n${this.message}`);
    if (this.stack) {
      console.groupCollapsed('stack trace');
      console.log(this.stack);
      console.groupEnd();
    }
    end && this.logEnd();
  }

  public logEnd() {
    console.groupEnd();
  }
}