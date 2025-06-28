import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";

import { Bot } from "../bot";
import { Command } from "./command";

export class SkipCommand extends Command {
  public information(): object {
    const builder = new SlashCommandBuilder();

    builder.setName("skip");
    builder.setDescription("Skip the current song.");

    return builder.toJSON();
  }

  public async execute(interaction: CommandInteraction, bot: Bot): Promise<void> {
    if (!interaction.isChatInputCommand()) return;

    const queue = bot.distube.queues.get(interaction.guild);

    if (!queue || queue.songs.length === 0) {
      const embed = new EmbedBuilder();
      embed.setTitle("No songs are queued.");
      embed.setColor(this.color);
      embed.setDescription("No song can be skipped.");
      await interaction.reply({ embeds: [embed] });
      return;
    }

    const current = queue.songs[0];
    const remaining = Math.max(queue.songs.length - 2, 0);

    let next = null;
    if (queue.songs.length > 1) {
      next = await queue.skip();
    } else {
      queue.stop();
    }

    const embed = new EmbedBuilder();
    embed.setTitle(`Skipped ${current.name}`);
    embed.setURL(current.url);
    embed.setColor(this.color);
    if (next) {
      embed.setThumbnail(next.thumbnail || null);
      embed.setDescription(
        `Now playing [${next.name}](${next.url}). ${remaining} song${remaining === 1 ? "" : "s"} remaining.`
      );
    } else {
      embed.setDescription(`Queue is empty.`);
    }

    await interaction.reply({ embeds: [embed] });
  }
}
