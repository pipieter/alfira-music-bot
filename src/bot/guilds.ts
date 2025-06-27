import { getVoiceConnection } from "@discordjs/voice";
import {
  Client,
  Collection,
  Guild,
  Snowflake,
  VoiceBasedChannel,
} from "discord.js";
import { VoicePresence } from "./voice";
import { logger } from "../logger";

class GuildPresence {
  public readonly id: Snowflake;
  public readonly voice: VoicePresence;

  constructor(id: Snowflake) {
    this.voice = new VoicePresence(id);
    this.id = id;
  }

  public async getGuild(client: Client): Promise<Guild | null> {
    const guild = await client.guilds.fetch(this.id);
    if (!guild) {
      return null;
    }
    return guild;
  }

  public async getVoiceChannel(
    client: Client
  ): Promise<VoiceBasedChannel | null> {
    const guild = await this.getGuild(client);
    const connection = getVoiceConnection(this.id);
    const channelId = connection?.joinConfig.channelId;

    if (!channelId) {
      return null;
    }

    const channel = await guild.channels.fetch(channelId);
    if (!channel || !channel.isVoiceBased()) {
      return null;
    }
    return channel;
  }
}

class GuildPresences {
  private guilds: Collection<string, GuildPresence> = new Collection();

  public async update(client: Client): Promise<void> {
    logger.info("Updating guilds...");
    const guilds = await client.guilds.fetch();
    for (const guild of guilds.keys()) {
      if (!this.guilds.has(guild)) {
        this.guilds.set(guild, new GuildPresence(guild));
      }
    }
  }

  public get(guild: Snowflake): GuildPresence | null {
    return this.guilds.get(guild) || null;
  }
}

export const Guilds = new GuildPresences();
