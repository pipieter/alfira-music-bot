import { ButtonInteraction } from "discord.js";

import { Services } from "../../services/services";
import { YouTube } from "../../services/youtube";
import { ButtonInteractionHandler } from "../handler";

export class YouTubePlayButtonHandler extends ButtonInteractionHandler {
  public shouldHandle(interaction: ButtonInteraction): boolean {
    return interaction.customId.startsWith("youtube-play::");
  }
  public async handle(interaction: ButtonInteraction): Promise<void> {
    const id = interaction.customId.split("::")[1];
    const url = YouTube.getURL(id);

    const guild = Services.guilds.get(interaction.guild.id);
    interaction.reply("Queuing audio.");
    guild.voice.enqueue(url);
  }
}
