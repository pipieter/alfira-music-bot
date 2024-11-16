import { VoicePresence } from "./voice";

export class GuildPresence {
  public readonly id: string;
  public readonly voice: VoicePresence;

  constructor(id: string) {
    this.id = id;
    this.voice = new VoicePresence(id);
  }
}
