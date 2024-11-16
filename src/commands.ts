import { Command } from "./bot/command";
import { EchoCommand } from "./commands/echo";
import { JoinCommand } from "./commands/join";
import { PingCommand } from "./commands/ping";

export enum CommandName {
  Ping = "ping",
  Echo = "echo",
  Join = "join",
}

export const Commands: Map<CommandName, Command> = new Map([
  [CommandName.Ping, new PingCommand()],
  [CommandName.Echo, new EchoCommand()],
  [CommandName.Join, new JoinCommand()],
]);
