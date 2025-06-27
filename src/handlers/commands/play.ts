import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { t } from "i18next";

import { GetCurrentVoiceChannel, GetUserVoiceChannel } from "../../bot/channel";
import { Command, CommandInteractionHandler } from "../handler";
import { YouTube } from "../../bot/youtube";
import {
  createAudioPlayer,
  createAudioResource,
  getVoiceConnection,
} from "@discordjs/voice";
import { Guilds } from "../../bot/guilds";

export class PlayCommandHandler extends CommandInteractionHandler {
  public command: Command = Command.Play;

  public information(): object {
    const builder = new SlashCommandBuilder();

    builder.setName(Command.Play);
    builder.setDescription("Play a song.");
    builder.addStringOption((option) => {
      option.setName("search");
      option.setDescription("The query for the song.");
      option.setRequired(true);
      return option;
    });

    return builder.toJSON();
  }
  public async handle(interaction: CommandInteraction): Promise<void> {
    if (!interaction.isChatInputCommand()) return;

    const user = interaction.user;

    const link = interaction.options.getString("search");
    const guild = Guilds.get(interaction.guild.id);

    const discordGuild = await guild.getGuild(interaction.client);
    const voiceChannel = await GetCurrentVoiceChannel(discordGuild);
    if (!voiceChannel) {
      const userChannel = await GetUserVoiceChannel(user, discordGuild);
      if (!userChannel) {
        interaction.reply("User is not in channel");
        return;
      }
      guild.voice.join(userChannel);
    }

    const stream = YouTube.getAudioStream(link);
    const player = createAudioPlayer();
    const resource = createAudioResource(stream);

    const connection = getVoiceConnection(guild.id);

    connection.subscribe(player);
    player.play(resource);
    // guild.voice.enqueue(video)
    // interaction.reply("Whoops. Looks like /play is currently disabled!");
    // guild.voice.enqueue(link);
  }
}
