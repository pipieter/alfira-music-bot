import { GuildPresence } from "../bot/guild";

export class GuildService {
  private guilds: Map<string, GuildPresence>;

  constructor() {
    this.guilds = new Map();
  }

  public get(id: string): GuildPresence {
    if (!this.guilds.has(id)) {
      this.guilds.set(id, new GuildPresence(id));
    }
    return this.guilds.get(id);
  }
}
