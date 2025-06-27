import { YouTubePlugin } from "@distube/youtube";
import {
  Client,
  IntentsBitField,
  Events as DiscordEvents,
  Collection,
  REST,
  Routes,
  Interaction,
} from "discord.js";
import DisTube from "distube";
import { logger } from "./logger";
import { PlayCommand } from "./commands/play";

const commands = new Collection([["play", new PlayCommand()]]);

export class Bot extends Client {
  public readonly distube: DisTube;

  constructor() {
    const intents = new IntentsBitField();
    intents.add(IntentsBitField.Flags.Guilds);
    intents.add(IntentsBitField.Flags.GuildVoiceStates);
    intents.add(IntentsBitField.Flags.GuildMembers);

    super({ intents });
    this.on(DiscordEvents.ClientReady, this.onClientReady);
    this.on(DiscordEvents.InteractionCreate, this.onInteraction);

    this.distube = new DisTube(this, { plugins: [new YouTubePlugin()] });
  }

  private async onClientReady(client: Client) {
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

  private async onInteraction(interaction: Interaction): Promise<void> {
    if (interaction.user.bot) return;
    if (!interaction.isCommand()) return;

    const command = commands.get(interaction.commandName);
    if (command) {
      return command.execute(interaction, this);
    } else {
      logger.error(
        `Could not handle ${interaction.type} interaction from ${interaction.user.globalName}`
      );
    }
  }
}
