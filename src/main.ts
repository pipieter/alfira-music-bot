import "dotenv/config";
import { logger } from "./logger";
import { Bot } from "./bot";

async function main() {
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token) {
    logger.error("Could not retrieve bot token. Stopping bot.");
    return;
  }

  const bot = new Bot();
  bot.login(token);
}

main();
