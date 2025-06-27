import "dotenv/config";
import { logging } from "./logging";
import { Bot } from "./bot";

async function main() {
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token) {
    logging.error("Could not retrieve bot token. Stopping bot.");
    return;
  }

  const bot = new Bot();
  bot.login(token);
}

main();
