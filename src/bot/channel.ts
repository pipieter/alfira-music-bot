import { Channel, Guild, User } from "discord.js";

export async function GetUserVoiceChannel(
  user: User,
  guild: Guild
): Promise<Channel | null> {
  const member = await guild.members.fetch(user);
  return member.voice.channel;
}
