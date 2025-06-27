import { Client, CommandInteraction } from "discord.js";
import DisTube from "distube";
import { Bot } from "../bot";

export abstract class Command {
  public abstract information(): object;
  public abstract execute(interaction: CommandInteraction, bot: Bot): Promise<void>;
}
