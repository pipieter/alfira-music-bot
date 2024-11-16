import { Command } from "./bot/command";
import { JoinCommand } from "./commands/join";
import { PingCommand } from "./commands/ping";
import { PlayCommand } from "./commands/play";

export enum CommandName {
  Ping = "ping",
  Join = "join",
  Play = "play",
}

export const Commands: Map<CommandName, Command> = new Map([
  [CommandName.Ping, new PingCommand()],
  [CommandName.Join, new JoinCommand()],
  [CommandName.Play, new PlayCommand()],
]);
