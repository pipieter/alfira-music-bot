import "dotenv/config";

import { BotClient } from "./bot/client";
import { logger } from "./logger";
import { translation } from "./services/translation";

const token = process.env.DISCORD_BOT_TOKEN;
const applicationId = process.env.DISCORD_BOT_APPLICATION_ID;

if (!token) {
  logger.error("Could not retrieve bot token, quitting bot.");
  process.exit(1);
}

if (!applicationId) {
  logger.error("Could not retrieve bot client id, quitting bot.");
  process.exit(1);
}

async function main() {
  translation.setup();

  const client = new BotClient(token);

  await client.run();
}

main();
