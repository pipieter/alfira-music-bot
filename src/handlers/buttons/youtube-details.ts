import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";

import { Color } from "../../const";
import { YouTube } from "../../services/youtube";
import { ButtonInteractionHandler } from "../handler";

export class YouTubeDetailsButtonHandler extends ButtonInteractionHandler {
  public override shouldHandle(interaction: ButtonInteraction): boolean {
    return interaction.customId.startsWith("youtube-search::");
  }

  public async handle(interaction: ButtonInteraction): Promise<void> {
    const id = interaction.customId.split("::")[1];
    const video = await YouTube.getVideoDetails(id);

    // Embed
    const embed = new EmbedBuilder();
    embed.setTitle(video.title);
    embed.setColor(Color.Main);
    embed.setThumbnail(video.thumbnail);
    embed.addFields([
      {
        name: "Channel",
        value: video.channel,
      },
      {
        name: "Length",
        value: video.length,
      },
    ]);
    embed.setDescription(`[YouTube link](${YouTube.getURL(video.id)})`);

    // Buttons
    const playButton = new ButtonBuilder();
    playButton.setLabel("Play");
    playButton.setEmoji("▶️");
    playButton.setStyle(ButtonStyle.Primary);
    playButton.setCustomId(`youtube-play::${id}`);

    const row = new ActionRowBuilder();
    row.addComponents(playButton);

    interaction.reply({
      embeds: [embed.toJSON()],
      //@ts-expect-error Discord typing error
      components: [row],
    });
  }
}
