import {
  ActivitiesOptions,
  Client,
  CommandInteraction,
  Events,
  IntentsBitField,
  Interaction,
  REST,
  Routes,
} from "discord.js";
import { logger } from "./logger";
import { Guilds } from "./bot/guilds";
import { CommandInteractionHandlers } from "./handlers";

class BotClient extends Client {
  constructor() {
    const intents = new IntentsBitField();
    intents.add(IntentsBitField.Flags.Guilds);
    intents.add(IntentsBitField.Flags.GuildVoiceStates);
    intents.add(IntentsBitField.Flags.GuildMembers);

    super({ intents });

    this.on(Events.ClientReady, this.onClientReady);
    this.on(Events.InteractionCreate, this.onInteraction);
  }

  public async run() {
    const token = this.getToken();

    if (!token) {
      logger.error("Could not retrieve bot token. Stopping bot.");
      return;
    }

    logger.info("Starting bot.");
    this.login(token);
  }

  private getToken() {
    const token = process.env.DISCORD_BOT_TOKEN;
    if (!token) return null;
    return token;
  }

  private async onClientReady(client: Client) {
    logger.info("Client is ready.");
    Guilds.update(client);

    logger.info("Updating the commands for all guilds.");

    const commandsInformation = [];

    for (const command of CommandInteractionHandlers) {
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

  private static async onCommandInteraction(
    interaction: CommandInteraction
  ): Promise<void> {
    for (const handler of CommandInteractionHandlers) {
      if (handler.shouldHandle(interaction)) {
        return handler.handle(interaction);
      }
    }

    logger.error(`Could not handle command ${interaction.commandName}`);
  }

  private async onInteraction(interaction: Interaction): Promise<void> {
    if (interaction.user.bot) return;

    if (interaction.isCommand()) {
      return BotClient.onCommandInteraction(interaction);
    }

    logger.error(
      `Could not handle ${interaction.type} interaction from ${interaction.user.globalName}`
    );
  }

  public setStatus(status: ActivitiesOptions) {
    this.user.setActivity(status);
  }
}

export const Bot = new BotClient();
