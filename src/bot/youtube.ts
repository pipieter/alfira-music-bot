import ytdl from "@distube/ytdl-core";
import youtubeSearch from "youtube-search-api";

export class YouTubeVideo {
  public readonly id: string;
  public readonly title: string;
  public readonly length: string;
  public readonly channel: string;
  public readonly thumbnail: string;
  public readonly url: string;

  constructor(
    id: string,
    title: string,
    length: string,
    channel: string,
    thumbnail: string
  ) {
    this.id = id;
    this.title = title;
    this.length = length;
    this.channel = channel;
    this.thumbnail = thumbnail;
    this.url = YouTube.getURL(id);
  }
}

export class YouTube {
  public static setup() {}

  public static getAudioStream(url: string) {
    const stream = ytdl(url, {
      filter: "audioonly",
      highWaterMark: 1 << 25,
      liveBuffer: 2000,
    });
    return stream;
  }

  public static async getSearchResults(
    query: string,
    limit: number = 5
  ): Promise<YouTubeVideo[]> {
    const result = await youtubeSearch.GetListByKeyword(query, false, limit, [
      { type: "video" },
    ]);

    const videos = result.items.map(
      (item: any) =>
        new YouTubeVideo(
          item.id,
          item.title,
          item.length.simpleText,
          item.channelTitle,
          item.thumbnail.thumbnails[0].url
        )
    );

    return videos;
  }

  public static getURL(id: string): string {
    return `https://www.youtube.com/watch?v=${id}`;
  }
}
