import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";

import { Bot } from "../bot";
import { GetUserVoiceChannel } from "../bot/channel";
import { YouTube } from "../bot/youtube";
import { logging } from "../logging";
import { Command } from "./command";

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
    const results = await YouTube.getSearchResults(search, 1);

    if (results.length === 0) {
      logging.warn(`No results found for '${search}'.`);
      await interaction.reply(`No results found for ${search}`);
      return;
    }

    const result = results[0];
    logging.info(`Result found for query '${search}': ${result.title} (${result.url})`);

    const embed = new EmbedBuilder();
    embed.setTitle(result.title);
    embed.setAuthor({ name: "Added to queue", iconURL: interaction.user.avatarURL() });
    embed.setThumbnail(result.thumbnail);
    embed.setURL(result.url);
    embed.setColor(this.color);
    embed.addFields([{ name: "Channel", value: result.channel }]);
    embed.addFields([{ name: "Duration", value: result.length }]);

    bot.distube.play(channel, result.url);
    await interaction.reply({ embeds: [embed] });
  }
}
