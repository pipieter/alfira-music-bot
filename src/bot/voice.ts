import {
  AudioPlayerState,
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  DiscordGatewayAdapterCreator,
  getVoiceConnection,
  joinVoiceChannel,
} from "@discordjs/voice";
import { Channel, Guild } from "discord.js";

import { Services } from "../services/services";
import { YouTube } from "../services/youtube";

export class VoicePresence {
  private guild: string;
  private queue: string[];

  constructor(guild: string) {
    this.guild = guild;
    this.queue = [];
  }

  private async getGuild(): Promise<Guild> {
    const client = Services.client.get();
    return client.guilds.fetch(this.guild);
  }

  private async getChannel(channelId: string): Promise<Channel | null> {
    const guild = await this.getGuild();
    const channel = guild.channels.fetch(channelId);

    if (!channel) return null;
    return channel;
  }

  public async join(channel: Channel) {
    if (!channel) return;
    if (!channel.isVoiceBased()) return;

    //if (guild.members.me.voice.channelId !== channelId) {
    //  await this.clear();
    //}

    const adapterCreator = channel.guild.voiceAdapterCreator;
    joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: adapterCreator as DiscordGatewayAdapterCreator,
    });
  }

  public async enqueue(link: string) {
    this.queue.push(link);

    // If queue was empty, play next
    if (this.queue.length === 1) {
      this.next();
    }
  }

  public async next(): Promise<void> {
    if (this.queue.length === 0) {
      this.leave();
    }

    const link = this.queue.shift();
    const stream = YouTube.getAudioStream(link);
    const resource = createAudioResource(stream);

    const connection = getVoiceConnection(this.guild);
    const player = createAudioPlayer({});

    connection.subscribe(player);

    player.on("stateChange", this.onStageChange);
    player.play(resource);
  }

  public async leave(): Promise<void> {
    const connection = getVoiceConnection(this.guild);

    if (connection) {
      connection.disconnect();
    }
  }

  public async clear() {
    // TODO
  }

  public async onStageChange(_prev: AudioPlayerState, curr: AudioPlayerState) {
    if (curr.status === AudioPlayerStatus.Idle) {
      this.next();
    }
  }
}
