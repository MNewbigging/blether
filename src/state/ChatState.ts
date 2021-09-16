import { convertToRaw, EditorState, Modifier, SelectionState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { action, observable } from 'mobx';

import { BletherSettings } from '../model/Settings';
import { UserMessage } from '../model/UserMessage';

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
    this.messageHistory.push(message);

    // TODO Then send to all other participants

    // Then clear the editor
    this.clearEditor();
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
