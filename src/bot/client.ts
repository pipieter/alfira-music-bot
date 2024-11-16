import {
  Client,
  Events,
  IntentsBitField,
  Interaction,
  REST,
  Routes,
} from "discord.js";

import { CommandName, Commands } from "../commands";
import { logger } from "../logger";

export class BotClient {
  private token: string;

  private client: Client;

  public constructor(token: string) {
    this.token = token;
  }

  public async run(): Promise<void> {
    await this.setupClient();

    logger.info("Logging in to client and starting bot.");

    this.client.login(this.token);
  }

  private async setupClient() {
    logger.info("Setting up client.");

    const intents = new IntentsBitField();
    intents.add(IntentsBitField.Flags.Guilds);
    intents.add(IntentsBitField.Flags.GuildVoiceStates);
    intents.add(IntentsBitField.Flags.GuildMembers);

    this.client = new Client({ intents: intents });

    this.client.on(Events.ClientReady, this.onClientReady);
    this.client.on(Events.InteractionCreate, this.onInteraction);
  }

  private async onClientReady(client: Client) {
    logger.info("Client is ready.");

    logger.info("Updating the commands for all guilds.");

    const commandsInformation = [];

    for (const command of Commands.values()) {
      commandsInformation.push(command.information());
    }

    const rest = new REST();
    rest.setToken(client.token);

    const routes = [Routes.applicationCommands(client.application.id)];
    for (const [_, guild] of client.guilds.cache) {
      routes.push(
        Routes.applicationGuildCommands(client.application.id, guild.id)
      );
    }

    for (const route of routes) {
      await rest.put(route, { body: commandsInformation });
    }
  }

  private async onInteraction(interaction: Interaction): Promise<void> {
    // Don't interact with other bots
    if (interaction.user.bot) return;

    // Only support commands for now
    if (!interaction.isCommand()) return;

    const commandName = interaction.commandName;
    const command = Commands.get(commandName as CommandName);

    if (!command) {
      logger.error(`Unidentified command: '${commandName}'`);
      return;
    }

    try {
      command.handle(interaction);
    } catch (e: any) {
      logger.error(`Could not complete request '${commandName}':`);
      if (e instanceof Error) {
        logger.error(e.message);
        logger.error(e.stack);
      }
    }
  }
}
