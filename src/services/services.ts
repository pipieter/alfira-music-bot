import { ClientService } from "./client";
import { GuildService } from "./guilds";
import { TranslationService } from "./translation";

export class Services {
  public static translation: TranslationService;
  public static client: ClientService;
  public static guilds: GuildService;

  public static setup() {
    this.translation = new TranslationService();
    this.client = new ClientService();
    this.guilds = new GuildService();
  }
}
