import mongoose from "mongoose";
const { MONGODB_URL } = process.env;
import chalk from "chalk";

export const connect = () => {
  mongoose
    .connect(MONGODB_URL)
    .then(
      console.log(
        chalk.blue(
          `*---------------DB CONNECTION SUCCESSFULLY ---------------*`
        )
      )
    )
    .catch((err) => {
      console.log(chalk.red(`DB CONNECTION FAILED`));
      console.log(err);
      process.exit(1);
    });
};
