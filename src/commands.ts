import { Command } from "./bot/command";
import { EchoCommand } from "./commands/echo";
import { PingCommand } from "./commands/ping";

export enum CommandName {
  Ping = "ping",
  Echo = "echo",
}

export const Commands: Map<CommandName, Command> = new Map([
  [CommandName.Ping, new PingCommand()],
  [CommandName.Echo, new EchoCommand()],
]);
