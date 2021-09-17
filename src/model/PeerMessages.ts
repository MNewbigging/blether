import { User } from './Settings';

export enum MessageType {
  PARTICIPANTS = 'participants',
  USER_DATA = 'user-data',
}

export abstract class PeerMessage {
  constructor(public type: MessageType) {}
}

export class UserDataMessage extends PeerMessage {
  constructor(public userData: User) {
    super(MessageType.USER_DATA);
  }
}

export class ParticipantsMessage extends PeerMessage {
  constructor(public participants: User[]) {
    super(MessageType.PARTICIPANTS);
  }
}
