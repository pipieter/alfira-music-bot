import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";

import { Bot } from "../bot";
import { Command } from "./command";

export class StopCommand extends Command {
  public information(): object {
    const builder = new SlashCommandBuilder();

    builder.setName("stop");
    builder.setDescription("Stop the playing of all songs and leaves the channel.");

    return builder.toJSON();
  }

  public async execute(interaction: CommandInteraction, bot: Bot): Promise<void> {
    if (!interaction.isChatInputCommand()) return;

    const queue = bot.distube.getQueue(interaction.guild);

    if (!queue || queue.songs.length === 0) {
      const embed = new EmbedBuilder();
      embed.setTitle("No songs are playing.");
      embed.setColor(this.color);
      embed.setDescription("The queue is empty.");
      await interaction.reply({ embeds: [embed] });
    } else {
      const embed = new EmbedBuilder();
      embed.setTitle("Clearing all songs.");
      embed.setColor(this.color);
      embed.setDescription(`${queue.songs.length} songs cleared.`);

      queue.stop();
      bot.distube.voices.get(interaction.guild.id).leave();

      await interaction.reply({ embeds: [embed] });
    }
  }
}
