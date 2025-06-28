import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Bot } from "../bot";
import { Command } from "./command";

function formatDuration(duration: number): string {
  const seconds = duration % 60;
  const minutes = Math.floor(duration / 60) % 60;
  const hours = Math.floor(duration / 3600);

  const fseconds = seconds.toString().padStart(2, "0");
  const fminutes = minutes.toString().padStart(2, "0");
  const fhours = hours.toString().padStart(2, "0");

  if (hours) {
    return `${fhours}:${fminutes}:${fseconds}`;
  } else {
    return `${fminutes}:${fseconds}`;
  }
}

export class QueueCommand extends Command {
  public information(): object {
    const builder = new SlashCommandBuilder();

    builder.setName("queue");
    builder.setDescription("Get the current queue of songs.");

    return builder.toJSON();
  }

  public async execute(interaction: CommandInteraction, bot: Bot): Promise<void> {
    if (!interaction.isChatInputCommand()) return;

    const queue = bot.distube.queues.get(interaction.guild);

    if (!queue || queue.songs.length === 0) {
      const embed = new EmbedBuilder();
      embed.setTitle("No songs are queued.");
      embed.setColor(this.color);
      embed.setDescription("The queue is empty.");
      await interaction.reply({ embeds: [embed] });
      return;
    }

    const current = queue.songs[0];
    const queued = queue.songs.slice(1);

    const embed = new EmbedBuilder();
    embed.setTitle(`${queued.length} song${queued.length === 1 ? " is " : "s are "} queued.`);
    embed.setColor(this.color);
    embed.setThumbnail(current.thumbnail || null);

    // Currently playing
    embed.addFields([
      {
        name: "Currently playing",
        value: `${current.formattedDuration.padStart(5, " ")} | [${current.name}](${current.url})`,
      },
    ]);

    // Queued songs
    if (queued && queued.length > 0) {
      const formatted = queued.map(
        (s) => `- ${s.formattedDuration.padStart(5, " ")} | [${s.name}](${s.url})`
      );

      embed.addFields([{ name: "Queued", value: formatted.join("\n") }]);
      embed.addFields([{ name: "Duration", value: formatDuration(queue.duration) }]);
    } else {
      embed.addFields([{ name: "Queued", value: "No songs queued." }]);
    }

    await interaction.reply({ embeds: [embed] });
  }
}
