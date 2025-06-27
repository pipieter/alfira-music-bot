import { JoinCommandHandler } from "./handlers/commands/join";
import { PingCommandHandler } from "./handlers/commands/ping";
import { PlayCommandHandler } from "./handlers/commands/play";
import { SearchCommandHandler } from "./handlers/commands/search";
import { CommandInteractionHandler } from "./handlers/handler";

export const CommandInteractionHandlers: CommandInteractionHandler[] = [
  new PingCommandHandler(),
  new JoinCommandHandler(),
  new PlayCommandHandler(),
  new SearchCommandHandler(),
];
