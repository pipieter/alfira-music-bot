import {
  AudioPlayerState,
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  DiscordGatewayAdapterCreator,
  getVoiceConnection,
  joinVoiceChannel,
} from "@discordjs/voice";
import { ActivityType, Snowflake, VoiceBasedChannel } from "discord.js";

import { YouTube, YouTubeVideo } from "./youtube";
import { Bot } from "../bot";

export class VoicePresence {
  private readonly guild: Snowflake;
  private readonly queue: YouTubeVideo[];

  constructor(guild: string) {
    this.guild = guild;
    this.queue = [];
  }

  public async join(channel: VoiceBasedChannel) {
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

  public async enqueue(video: YouTubeVideo) {
    this.queue.push(video);

    // If queue was empty, play next
    if (this.queue.length === 1) {
      this.next();
    }
  }

  public async next(): Promise<void> {
    if (this.queue.length === 0) {
      this.leave();
      return;
    }

    const video = this.queue.shift();
    const stream = YouTube.getAudioStream(video.url);
    const resource = createAudioResource(stream);

    const connection = getVoiceConnection(this.guild);
    const player = createAudioPlayer({});

    connection.subscribe(player);

    player.on("stateChange", (_, state) => {
      VoicePresence.onStageChange(this, state);
    });
    player.play(resource);

    Bot.setStatus({
      name: video.title,
      type: ActivityType.Listening,
      url: video.url,
    });
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

  public static async onStageChange(
    presence: VoicePresence,
    state: AudioPlayerState
  ) {
    if (state.status === AudioPlayerStatus.Idle) {
      presence.next();
    }
  }
}
