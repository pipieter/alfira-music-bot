import { getVoiceConnection } from "@discordjs/voice";
import { Guild, User, VoiceBasedChannel } from "discord.js";

export async function GetUserVoiceChannel(
  user: User,
  guild: Guild
): Promise<VoiceBasedChannel | null> {
  const member = await guild.members.fetch(user);
  return member.voice.channel;
}

export async function GetCurrentVoiceChannel(guild: Guild): Promise<VoiceBasedChannel | null> {
  const connection = getVoiceConnection(guild.id);
  if (!connection) {
    return null;
  }

  const channelId = connection.joinConfig.channelId;
  const channel = await guild.channels.fetch(channelId);

  if (!channel || !channel.isVoiceBased()) {
    return null;
  }
  return channel;
}
