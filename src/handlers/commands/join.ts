import { Channel, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { t } from "i18next";

import { GetUserVoiceChannel } from "../../bot/channel";
import { Services } from "../../services/services";
import { Command, CommandInteractionHandler } from "../handler";

export class JoinCommandHandler extends CommandInteractionHandler {
  public command: Command = Command.Join;

  public information(): object {
    const builder = new SlashCommandBuilder();

    builder.setName(Command.Join);
    builder.setDescription(t("commands.join.description"));
    builder.addChannelOption((option) => {
      option.setName("channel");
      option.setDescription(t("commands.join.input.channel"));
      option.setRequired(false);
      return option;
    });

    return builder.toJSON();
  }

  public async handle(interaction: CommandInteraction): Promise<void> {
    if (!interaction.isChatInputCommand()) return;

    let channel: Channel = interaction.options.getChannel("channel") as Channel;
    if (!channel) {
      const user = interaction.user;
      const guild = interaction.guild;
      channel = await GetUserVoiceChannel(user, guild);

      if (!channel) {
        interaction.reply(
          "No channel provided and user is not in a voice channel."
        );
        return;
      }
    }

    if (!channel.isVoiceBased()) {
      interaction.reply("Channel is not a voice channel");
      return;
    }

    interaction.reply(`Joining channel <#${channel.id}>`);
    const guild = Services.guilds.get(interaction.guild.id);
    guild.voice.join(channel);
  }
}
