import { Interaction, SlashCommandBuilder } from "discord.js";
import { t } from "i18next";

import { Command } from "../bot/command";
import { CommandName } from "../commands";

export class PingCommand extends Command {
  public override information(): object {
    const builder = new SlashCommandBuilder();

    builder.setName(CommandName.Ping);
    builder.setDescription(t("commands.ping.description"));

    return builder.toJSON();
  }

  public override async handle(interaction: Interaction): Promise<void> {
    if (!interaction.isRepliable()) return;

    interaction.reply("Pong!");
  }
}
