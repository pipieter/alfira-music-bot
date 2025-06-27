import chalk, { ChalkInstance } from "chalk";
import { DateTime } from "luxon";

export class logging {
  private static date(): string {
    const now = DateTime.now();
    return now.toFormat("yyyy-MM-dd hh:mm:ss");
  }

  private static write(
    message: any,
    color: ChalkInstance,
    intermediate?: string
  ): void {
    intermediate = intermediate ? ` ${intermediate}:` : "";

    const formatted = `[${logging.date()}]${intermediate} ${message}`;

    // eslint-disable-next-line no-console
    console.log(color(formatted));
  }

  public static info(message: any): void {
    logging.write(message, chalk.green);
  }

  public static warn(message: any): void {
    logging.write(message, chalk.yellow, "WARNING");
  }

  public static error(message: any): void {
    logging.write(message, chalk.red, "ERROR");
  }
}
