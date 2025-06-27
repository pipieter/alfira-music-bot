import "dotenv/config";
import { Bot } from "./bot";

async function main() {
  await Bot.run();
}

main();
