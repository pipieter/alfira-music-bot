import "dotenv/config";
import {
  Collection,
  IntentsBitField,
  Events as DiscordEvents,
  Client,
  REST,
  Routes,
  Interaction,
  EmbedBuilder,
} from "discord.js";
import { PlayCommand } from "./commands/play";
import { logger } from "./logger";
import DisTube, { Queue, Song, Events as DisTubeEvents } from "distube";
import { YouTubePlugin } from "@distube/youtube";

const commands = new Collection([["play", new PlayCommand()]]);

// Set-up client
const intents = new IntentsBitField();
intents.add(IntentsBitField.Flags.Guilds);
intents.add(IntentsBitField.Flags.GuildVoiceStates);
intents.add(IntentsBitField.Flags.GuildMembers);

const client = new Client({ intents });
const distube = new DisTube(client, { emitNewSongOnly: true, plugins: [new YouTubePlugin()] });

client.on(DiscordEvents.ClientReady, onClientReady);
client.on(DiscordEvents.InteractionCreate, onInteraction);

async function onClientReady(client: Client) {
  logger.info("Client is ready.");
  const commandsInformation = [];

  for (const command of commands.values()) {
    commandsInformation.push(command.information());
  }

  const rest = new REST();
  rest.setToken(client.token);

  const routes = [Routes.applicationCommands(client.application.id)];
  for (const [_, guild] of client.guilds.cache) {
    routes.push(Routes.applicationGuildCommands(client.application.id, guild.id));
  }

  for (const route of routes) {
    await rest.put(route, { body: commandsInformation });
  }
}

async function onInteraction(interaction: Interaction): Promise<void> {
  if (interaction.user.bot) return;
  if (!interaction.isCommand()) return;

  const command = commands.get(interaction.commandName);
  if (command) {
    return command.execute(interaction, client, distube);
  } else {
    logger.error(
      `Could not handle ${interaction.type} interaction from ${interaction.user.globalName}`
    );
  }
}

// Run the bot
const token = process.env.DISCORD_BOT_TOKEN;
if (!token) {
  logger.error("Could not retrieve bot token. Stopping bot.");
  process.exit(1);
}
client.login(token);
