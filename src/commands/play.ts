import { Interaction, SlashCommandBuilder } from "discord.js";
import { t } from "i18next";

import {} from "../bot/channel";
import { Command } from "../bot/command";
import { CommandName } from "../commands";
import { Services } from "../services/services";

export class PlayCommand extends Command {
  public information(): object {
    const builder = new SlashCommandBuilder();

    builder.setName(CommandName.Play);
    builder.setDescription(t("commands.play.description"));
    builder.addStringOption((option) => {
      option.setName("search");
      option.setDescription(t("commands.play.input.search"));
      option.setRequired(true);
      return option;
    });

    return builder.toJSON();
  }
  public async handle(interaction: Interaction): Promise<void> {
    if (!interaction.isChatInputCommand()) return;

    const link = interaction.options.getString("search");
    const guild = Services.guilds.get(interaction.guild.id);

    interaction.reply("Queuing audio.");
    guild.voice.enqueue(link);
  }
}
