import ytdl from "@distube/ytdl-core";

export class YouTube {
  public static setup() {}

  public static getAudioStream(link: string) {
    const stream = ytdl(link, {
      filter: "audioonly",
      highWaterMark: 1 << 30,
      liveBuffer: 1 << 30,
      dlChunkSize: 0,
    });
    return stream;
  }
}
