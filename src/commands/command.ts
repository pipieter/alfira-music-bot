import { CommandInteraction } from "discord.js";

import { Bot } from "../bot";

export abstract class Command {
  public abstract information(): object;
  public abstract execute(interaction: CommandInteraction, bot: Bot): Promise<void>;
}
