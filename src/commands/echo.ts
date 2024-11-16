import { Interaction, SlashCommandBuilder } from "discord.js";
import { t } from "i18next";

import { Command } from "../bot/command";
import { CommandName } from "../commands";

export class EchoCommand extends Command {
  public override information(): object {
    const builder = new SlashCommandBuilder();

    builder.setName(CommandName.Echo);
    builder.setDescription(t("commands.echo.description"));
    builder.addStringOption((option) => {
      option.setName("message");
      option.setDescription(t("commands.echo.input.message"));
      option.setRequired(true);
      return option;
    });

    return builder.toJSON();
  }

  public override handle(interaction: Interaction): Promise<void> {
    if (!interaction.isRepliable()) return;
    if (!interaction.isChatInputCommand()) return;

    const message = interaction.options.getString("message");
    interaction.reply(message);
  }
}
