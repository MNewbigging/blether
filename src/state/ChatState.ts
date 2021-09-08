import { convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { action, observable } from 'mobx';

import { BletherSettings } from '../model/Settings';

export class ChatState {
  @observable public sidebarOpen = true;

  public userSettings: BletherSettings;
  @observable public editorState = EditorState.createEmpty();
  @observable public editorContent = '';

  constructor(settings: BletherSettings) {
    this.userSettings = settings;
  }

  @action public toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  @action public setEditorState(editorState: EditorState) {
    this.editorState = editorState;
    this.editorContent = draftToHtml(convertToRaw(editorState.getCurrentContent()));
  }
}
