import chalk from 'chalk';

export class Console {
  static log(message: string) {
    this.callConsole(message, 'white');
  }

  static error(message: string) {
    this.callConsole(message, 'red');
  }

  static warn(message: string) {
    this.callConsole(message, 'yellow');
  }

  static success(message: string) {
    this.callConsole(message, 'green');
  }

  static info(message: string) {
    this.callConsole(message, 'blue');
  }

  private static formatWithDate(message: string) {
    const dateTime = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    }).format(new Date());

    return `[${dateTime}] ${message}`;
  }

  private static callConsole(message: string, color: string) {
    const formattedMessage = (chalk as any)[color](
      this.formatWithDate(message)
    );
    console.log(formattedMessage);
  }
}
