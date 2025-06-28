import { ColorResolvable, CommandInteraction } from "discord.js";

import { Bot } from "../bot";

export abstract class Command {
  public readonly color: ColorResolvable = "#5391ba";

  public abstract information(): object;
  public abstract execute(interaction: CommandInteraction, bot: Bot): Promise<void>;
}
