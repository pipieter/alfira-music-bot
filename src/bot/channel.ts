import { Guild, User, VoiceBasedChannel } from "discord.js";

export async function GetUserVoiceChannel(
  user: User,
  guild: Guild
): Promise<VoiceBasedChannel | null> {
  const member = await guild.members.fetch(user);
  return member.voice.channel;
}
