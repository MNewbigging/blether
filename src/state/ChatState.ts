import { convertToRaw, EditorState, Modifier, SelectionState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { action, observable } from 'mobx';
import { MessageType, PeerMessage, UserDataMessage } from '../model/PeerMessages';

import { SettingsData, User } from '../model/Settings';
import { UserMessage } from '../model/UserMessage';
import { TimeUtils } from '../utils/TimeUtils';
import { ConnectionState } from './ConnectionState';

export class ChatState {
  @observable public sidebarOpen = true;

  public userSettings: SettingsData;
  @observable public editorState = EditorState.createEmpty();
  @observable public editorContent = '';

  @observable public messageHistory: UserMessage[] = [];

  public connectionState: ConnectionState;
  @observable public participants: User[] = [];

  constructor(settings: SettingsData, hostId?: string) {
    this.userSettings = settings;

    this.connectionState = new ConnectionState(settings, hostId);
    this.connectionState.onselfopen = this.onConnectionReady;
    this.connectionState.onreceivedata = this.receivePeerMessage;

    window.addEventListener('keydown', this.onKeyDown);
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
    const message: UserMessage = {
      content: this.editorContent,
      time: JSON.stringify(Date.now()),
      name: this.userSettings.name,
      icon: this.userSettings.icon,
    };

    // Add own message to message history straight away
    this.receiveMessage(message);

    // TODO Then send to all other participants

    // Then clear the editor
    this.clearEditor();
  }

  @action private readonly onConnectionReady = () => {
    this.participants.push({
      name: this.userSettings.name,
      icon: this.userSettings.icon,
    });
  };

  private readonly receivePeerMessage = (message: PeerMessage) => {
    console.log('received message: ', message);

    switch (message.type) {
      case MessageType.USER_DATA:
        const userMsg = message as UserDataMessage;
        this.participants.push({
          name: userMsg.userData.name,
          icon: userMsg.userData.icon,
        });
        break;
    }
  };

  @action private readonly receiveMessage = (message: UserMessage) => {
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

      if (Math.abs(curTime - lastTime) < newMessageCutoff) {
        // Add this message's content into the last
        lastMsg.content += message.content;
        return;
      }
    }

    this.messageHistory.push(message);
  };

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
}
