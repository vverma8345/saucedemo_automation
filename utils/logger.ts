import chalk from "chalk";

type LogLevel = "info" | "warn" | "error";

export function log(level: LogLevel, message: string) {
  const plainLine = `[${level.toUpperCase()}] ${message}`;

  switch (level) {
    case "info":
      console.log(chalk.blue(plainLine));
      break;
    case "warn":
      console.warn(chalk.yellow(plainLine));
      break;
    case "error":
      console.error(chalk.red(plainLine));
      break;
  }
}