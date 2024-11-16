import { Interaction, SlashCommandBuilder } from "discord.js";
import { t } from "i18next";

import { JoinUserVoiceChannel, JoinVoiceChannel } from "../bot/channel";
import { Command } from "../bot/command";
import { CommandName } from "../commands";

export class JoinCommand extends Command {
  public information(): object {
    const builder = new SlashCommandBuilder();

    builder.setName(CommandName.Join);
    builder.setDescription(t("commands.join.description"));
    builder.addChannelOption((option) => {
      option.setName("channel");
      option.setDescription(t("commands.join.input.channel"));
      option.setRequired(false);
      return option;
    });

    return builder.toJSON();
  }

  public async handle(interaction: Interaction): Promise<void> {
    if (!interaction.isRepliable()) return;
    if (!interaction.isChatInputCommand()) return;

    const channel = interaction.options.getChannel("channel");

    const voiceChannel = channel
      ? await JoinVoiceChannel(interaction, channel.id)
      : await JoinUserVoiceChannel(interaction);

    if (voiceChannel) {
      interaction.reply(`Joining voice channel <#${voiceChannel.id}>`);
    }
  }
}
