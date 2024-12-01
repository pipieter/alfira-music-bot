import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { t } from "i18next";

import { Command, CommandInteractionHandler } from "../handler";

export class PingCommandHandler extends CommandInteractionHandler {
  public command: Command = Command.Ping;

  public override information(): object {
    const builder = new SlashCommandBuilder();

    builder.setName(Command.Ping);
    builder.setDescription(t("commands.ping.description"));

    return builder.toJSON();
  }

  public override async handle(interaction: CommandInteraction): Promise<void> {
    interaction.reply("Pong!");
  }
}
