import { Client, CommandInteraction } from "discord.js";
import DisTube from "distube";

export abstract class Command {
  public abstract information(): object;
  public abstract execute(
    interaction: CommandInteraction,
    client: Client,
    distube: DisTube
  ): Promise<void>;
}
