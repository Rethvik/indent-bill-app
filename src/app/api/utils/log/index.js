import chalk from "chalk";
const logger = (variant, message) => {
  if (variant === "success") {
    console.log(chalk.green(message));
  } else if (variant === "error") {
    console.log(chalk.red(message));
  } else if (variant === "info") {
    console.log(chalk.blue(message));
  }
};
export default logger;
