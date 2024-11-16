import { Interaction } from "discord.js";

export abstract class Command {
  public abstract information(): object;
  public abstract handle(interaction: Interaction): Promise<void>;
}
