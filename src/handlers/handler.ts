import { ButtonInteraction, CommandInteraction } from "discord.js";

export enum Command {
  Ping = "ping",
  Join = "join",
  Play = "play",
  Search = "search",
}

export abstract class InteractionHandler<Interaction> {
  public abstract shouldHandle(interaction: Interaction): boolean;
  public abstract handle(interaction: Interaction): Promise<void>;
}

export abstract class CommandInteractionHandler extends InteractionHandler<CommandInteraction> {
  public abstract readonly command: Command;

  public override shouldHandle(interaction: CommandInteraction): boolean {
    return interaction.commandName === this.command;
  }

  public abstract information(): object;
}

export abstract class ButtonInteractionHandler extends InteractionHandler<ButtonInteraction> {}
