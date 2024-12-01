import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { t } from "i18next";

import {} from "../../bot/channel";
import { Services } from "../../services/services";
import { Command, CommandInteractionHandler } from "../handler";

export class PlayCommandHandler extends CommandInteractionHandler {
  public command: Command = Command.Play;

  public information(): object {
    const builder = new SlashCommandBuilder();

    builder.setName(Command.Play);
    builder.setDescription(t("commands.play.description"));
    builder.addStringOption((option) => {
      option.setName("search");
      option.setDescription(t("commands.play.input.search"));
      option.setRequired(true);
      return option;
    });

    return builder.toJSON();
  }
  public async handle(interaction: CommandInteraction): Promise<void> {
    if (!interaction.isChatInputCommand()) return;

    const link = interaction.options.getString("search");
    const guild = Services.guilds.get(interaction.guild.id);

    interaction.reply("Queuing audio.");
    guild.voice.enqueue(link);
  }
}
