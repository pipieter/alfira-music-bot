import {
  DiscordGatewayAdapterCreator,
  getVoiceConnection,
  joinVoiceChannel,
  VoiceConnection,
} from "@discordjs/voice";
import { Interaction, VoiceBasedChannel } from "discord.js";

import { logger } from "../logger";

export async function JoinUserVoiceChannel(
  interaction: Interaction
): Promise<VoiceBasedChannel | null> {
  if (!interaction.isChatInputCommand()) {
    logger.error("Cannot reply to user join channel request.");
    return null;
  }

  const user = interaction.user;
  const guild = interaction.guild;
  const member = await guild.members.fetch(user);

  const voiceChannel = member.voice.channel;
  if (!voiceChannel) {
    interaction.reply("User is not in a voice channel.");
    return null;
  }

  return JoinVoiceChannel(interaction, voiceChannel.id);
}

export async function JoinVoiceChannel(
  interaction: Interaction,
  channelId: string
): Promise<VoiceBasedChannel | null> {
  if (!interaction.isChatInputCommand()) {
    logger.error("Cannot reply to join channel request.");
    return null;
  }

  if (!interaction.inGuild()) {
    logger.error(`Request must be made in a server to join a channel.`);
    return null;
  }

  const voiceChannel = await interaction.client.channels.fetch(channelId);

  if (!voiceChannel) {
    logger.error("Could not find channel");
    interaction.reply("Could not find voice channel.");
    return null;
  }

  if (!voiceChannel.isVoiceBased()) {
    logger.error("Requested channel is not a voice channel");
    interaction.reply(`Could not find voice channel.`);
    return null;
  }

  if (interaction.guild.id !== voiceChannel.guild.id) {
    logger.error("Requested channel is not in the interaction's server.");
    interaction.reply(`Could not find voice channel.`);
    return null;
  }

  const adapterCreator = voiceChannel.guild.voiceAdapterCreator;

  joinVoiceChannel({
    channelId: channelId,
    guildId: voiceChannel.guildId,
    adapterCreator: adapterCreator as DiscordGatewayAdapterCreator,
  });

  return voiceChannel;
}

export function GetVoiceChannelConnection(
  interaction: Interaction
): VoiceConnection | null {
  const connection = getVoiceConnection(interaction.guild.id);

  if (!connection) {
    return null;
  }
  return connection;
}
