import { convertToRaw, EditorState, Modifier, SelectionState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { action, observable } from 'mobx';
import {
  ExitMessage,
  MessageType,
  ParticipantsMessage,
  PeerMessage,
  UserDataMessage,
  UserTextMessage,
} from '../model/PeerMessages';

import { SettingsData, User } from '../model/Settings';
import { TextMessage } from '../model/TextMessage';
import { TimeUtils } from '../utils/TimeUtils';
import { ConnectionState } from './ConnectionState';

export class ChatState {
  @observable public sidebarOpen = true;
  public userSettings: SettingsData;
  @observable public editorState = EditorState.createEmpty();
  @observable public editorContent = '';
  @observable public messageHistory: TextMessage[] = [];
  public connectionState: ConnectionState;
  @observable public participants: User[] = [];

  constructor(settings: SettingsData, hostId?: string) {
    this.userSettings = settings;

    this.connectionState = new ConnectionState(settings, hostId);
    this.connectionState.onselfopen = this.onConnectionReady;
    this.connectionState.onreceivedata = this.receivePeerMessage;

    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('focus', this.resetTabTitle);
  }

  @action public toggleSidebar() {
    // TODO - in mobile mode, cannot toggle - always false
    this.sidebarOpen = !this.sidebarOpen;
  }

  public invite() {
    // Create an invite link and copy to clipboard
    const baseUrl = window.location.href;
    const fullUrl = baseUrl + '#/' + this.connectionState.self.id;

    navigator.clipboard.writeText(fullUrl);

    // TODO prevent inviting if no peer setup
    // TODO tell user text has been copied
  }

  public exitChat() {
    this.connectionState.disconnect();
  }

  @action public setEditorState(editorState: EditorState) {
    this.editorState = editorState;
    this.editorContent = draftToHtml(convertToRaw(editorState.getCurrentContent()));
  }

  private readonly onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      this.sendMessage();
    }
  };

  @action private sendMessage() {
    // Send editor content in a new message
    const message: TextMessage = {
      content: this.editorContent,
      time: JSON.stringify(Date.now()),
      name: this.userSettings.name,
      icon: this.userSettings.icon,
      locked: false,
    };

    // Add own message to message history straight away
    this.receiveTextMessage(message);

    // TODO Then send to all other participants
    const textMsg = new UserTextMessage(message);
    this.connectionState.sendGroupMessage(textMsg);

    // Then clear the editor
    this.clearEditor();
  }

  @action private readonly onConnectionReady = () => {
    const self: User = {
      peerId: this.connectionState.self.id,
      name: this.userSettings.name,
      icon: this.userSettings.icon,
    };

    for (let i = 0; i < 30; i++) this.participants.push(self);
  };

  private readonly receivePeerMessage = (message: PeerMessage) => {
    console.log('received message: ', message);

    switch (message.type) {
      case MessageType.USER_DATA:
        const userMsg = message as UserDataMessage;
        // Add new incoming user to users list
        const user: User = {
          peerId: userMsg.userData.peerId,
          name: userMsg.userData.name,
          icon: userMsg.userData.icon,
        };
        this.participants.push(user);
        this.connectionState.announceNewParticipant(user);
        break;
      case MessageType.PARTICIPANTS:
        // Connect to new users
        const partyMsg = message as ParticipantsMessage;
        partyMsg.participants.forEach((id) => this.connectionState.outgoingConnection(id));
        break;
      case MessageType.TEXT_MESSAGE:
        // Display the received message
        const textMsg = message as UserTextMessage;
        this.receiveTextMessage(textMsg.textMessage);
        this.newMessageTabTitle();
        break;
      case MessageType.EXIT_MESSAGE:
        this.onOtherLeaving(message as ExitMessage);
        break;
    }
  };

  @action private receiveTextMessage(message: TextMessage) {
    // Early return for first message sent (don't need to continue with other checks if so)
    if (!this.messageHistory.length) {
      this.messageHistory.push(message);
      return;
    }

    // Check if this new message has same sender as last
    const lastMsg = this.messageHistory[this.messageHistory.length - 1];
    if (lastMsg.name === message.name) {
      // Was it sent close to last?
      const newMessageCutoff = 1;
      const lastTimeStr = TimeUtils.getTimeMins(lastMsg.time);
      const lastTime = parseInt(lastTimeStr, 10);

      const curTimeStr = TimeUtils.getTimeMins(message.time);
      const curTime = parseInt(curTimeStr, 10);
      const recent = Math.abs(curTime - lastTime) < newMessageCutoff;

      if (recent && !lastMsg.locked) {
        // Add this message's content into the last
        lastMsg.content += message.content;
        return;
      }
    }

    this.messageHistory.push(message);
  }

  private onOtherLeaving(exitMsg: ExitMessage) {
    // Add a text message to say they left (no need to send it, everyone does this)
    const text: TextMessage = {
      content: ' has left',
      time: JSON.stringify(Date.now()),
      name: exitMsg.userData.name,
      icon: exitMsg.userData.icon,
      locked: true,
    };
    this.receiveTextMessage(text);

    // Remove their user object
    this.participants = this.participants.filter((user) => user.peerId !== exitMsg.userData.peerId);

    // Cleanup connections with leaver
    this.connectionState.cleanupConnections(exitMsg.userData.peerId);
  }

  private clearEditor() {
    let es = this.editorState;
    let cs = es.getCurrentContent();
    const first = cs.getFirstBlock();
    const last = cs.getLastBlock();
    const selected = new SelectionState({
      anchorKey: first.getKey(),
      anchorOffset: 0,
      focusKey: last.getKey(),
      focusOffset: last.getLength(),
      hasFocus: true,
    });
    cs = Modifier.removeRange(cs, selected, 'backward');
    es = EditorState.push(es, cs, 'remove-range');
    es = EditorState.forceSelection(es, cs.getSelectionAfter());

    this.editorState = es;
  }

  private newMessageTabTitle() {
    // Update the title
    document.title = 'blether - new message';

    // If the window is currently focused, clear after 1 sec
    if (document.hasFocus()) {
      this.resetTabTitle();
    }
  }

  private resetTabTitle = () => {
    setTimeout(() => (document.title = 'blether'), 1000);
  };
}
