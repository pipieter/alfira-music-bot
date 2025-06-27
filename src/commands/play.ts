import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "./command";
import { GetUserVoiceChannel } from "../bot/channel";
import { Bot } from "../bot";

export class PlayCommand extends Command {
  public information(): object {
    const builder = new SlashCommandBuilder();

    builder.setName("play");
    builder.setDescription("Play a song.");
    builder.addStringOption((option) => {
      option.setName("search");
      option.setDescription("The query for the song.");
      option.setRequired(true);
      return option;
    });

    return builder.toJSON();
  }
  public async execute(interaction: CommandInteraction, bot: Bot): Promise<void> {
    if (!interaction.isChatInputCommand()) return;

    const channel = await GetUserVoiceChannel(interaction.user, interaction.guild);
    const search = interaction.options.getString("search");
    console.log(search);

    bot.distube.play(channel, search);

    await interaction.reply(`Queuing song ${search}`);
  }
}
