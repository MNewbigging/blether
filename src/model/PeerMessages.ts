export enum MessageType {
  PARTICIPANTS = 'participants',
}

export abstract class PeerMessage {
  constructor(public type: MessageType) {}
}

export class ParticipantsMessage extends PeerMessage {
  constructor() {
    super(MessageType.PARTICIPANTS);
  }
}
