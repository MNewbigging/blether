import { convertToRaw, EditorState, Modifier, SelectionState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { action, observable } from 'mobx';

import { BletherSettings } from '../model/Settings';
import { UserMessage } from '../model/UserMessage';
import { TimeUtils } from '../utils/TimeUtils';

export class ChatState {
  @observable public sidebarOpen = true;

  public userSettings: BletherSettings;
  @observable public editorState = EditorState.createEmpty();
  @observable public editorContent = '';

  @observable public messageHistory: UserMessage[] = [];

  constructor(settings: BletherSettings) {
    this.userSettings = settings;
    window.addEventListener('keydown', this.onKeyDown);
  }

  @action public toggleSidebar() {
    // TODO - in mobile mode, cannot toggle - always false
    this.sidebarOpen = !this.sidebarOpen;
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

  @action private receiveMessage(message: UserMessage) {
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
}