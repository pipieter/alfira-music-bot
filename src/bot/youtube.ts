import ytdl from "@distube/ytdl-core";
import youtubeSearch from "youtube-search-api";

export class YoutubeVideo {
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

  public static getAudioStream(link: string) {
    const stream = ytdl(link, {
      filter: "audioonly",
      highWaterMark: 1 << 25,
      liveBuffer: 2000,
    });
    return stream;
  }

  public static async getSearchResults(
    query: string,
    limit: number = 5
  ): Promise<YoutubeVideo[]> {
    const result = await youtubeSearch.GetListByKeyword(query, false, limit, [
      { type: "video" },
    ]);

    const videos = result.items.map(
      (item: any) =>
        new YoutubeVideo(
          item.id,
          item.title,
          item.length.simpleText,
          item.channelTitle,
          item.thumbnail.thumbnails[0].url
        )
    );

    return videos;
  }

  public static async getVideoDetails(id: string): Promise<YoutubeVideo> {
    // A nice feature of youtube is that if you search an id, the first result is the video
    const videos = await YouTube.getSearchResults(id, 1);
    return videos[0];
  }

  public static getURL(id: string): string {
    return `https://www.youtube.com/watch?v=${id}`;
  }
}
