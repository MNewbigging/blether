import { User } from './Settings';
import { TextMessage } from './TextMessage';

export enum MessageType {
  PARTICIPANTS = 'participants',
  USER_DATA = 'user-data',
  TEXT_MESSAGE = 'text-message',
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
  constructor(public participants: string[]) {
    super(MessageType.PARTICIPANTS);
  }
}

export class UserTextMessage extends PeerMessage {
  constructor(public textMessage: TextMessage) {
    super(MessageType.TEXT_MESSAGE);
  }
}
