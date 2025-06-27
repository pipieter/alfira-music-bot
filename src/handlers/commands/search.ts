import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";

import { Color } from "../../const";
import { YouTube } from "../../bot/youtube";
import { Command, CommandInteractionHandler } from "../handler";

export class SearchCommandHandler extends CommandInteractionHandler {
  public command: Command = Command.Search;

  public information(): object {
    const builder = new SlashCommandBuilder();

    builder.setName(Command.Search);
    builder.setDescription("Search for something");
    builder.addStringOption((option) => {
      option.setName("query");
      option.setDescription("The thing to search for.");
      option.setRequired(true);
      return option;
    });

    return builder.toJSON();
  }
  public async handle(interaction: CommandInteraction): Promise<void> {
    if (!interaction.isChatInputCommand()) return;

    const query = interaction.options.getString("query");
    const videos = await YouTube.getSearchResults(query);

    const embed = new EmbedBuilder();
    embed.setColor(Color.Main);
    embed.setTitle(`Results for '${query}':`);
    embed.addFields(
      videos.map((video, i) => ({
        name: `${i + 1}. ${video.title}`,
        value: `${video.channel} - ${video.length}`,
        inline: false,
      }))
    );
    embed.setFooter({
      text: "You can press on the buttons below for more information.",
    });

    const buttons = [];
    for (let i = 0; i < videos.length; i++) {
      const button = new ButtonBuilder();
      button.setCustomId(`youtube-search::${videos[i].id}`);
      button.setLabel(`Video ${i + 1}`);
      button.setStyle(ButtonStyle.Secondary);

      buttons.push(button);
    }

    const row = new ActionRowBuilder();
    row.addComponents(buttons);

    await interaction.reply({
      embeds: [embed.toJSON()],
      //@ts-expect-error Discord typing error
      components: [row],
    });
  }
}
