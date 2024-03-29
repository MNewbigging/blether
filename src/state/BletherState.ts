import { action, observable } from 'mobx';
import { BletherSettings, SettingsData } from '../model/Settings';
import { ChatState } from './ChatState';

export enum DialogState {
  OPEN = 'open',
  CLOSING = 'closing',
  CLOSED = 'closed',
}

export enum BletherScreen {
  HOME = 'home',
  CHAT = 'chat',
}

const settingsKey = 'SETTINGS';

export class BletherState {
  @observable public screen = BletherScreen.HOME;
  @observable public settings = new BletherSettings();
  @observable public settingsDialogState = DialogState.CLOSED;
  @observable public joining = false;
  public chatState?: ChatState;
  private hostId: string | undefined;

  constructor() {
    this.loadSettings();
    this.checkRoute();
  }

  @action public openSettings() {
    this.settingsDialogState = DialogState.OPEN;
  }

  @action public saveSettings() {
    // Save settings to local storage
    const data = this.settings.toData();
    const json = JSON.stringify(data);

    localStorage.setItem(settingsKey, json);

    // Then close the dialog
    this.settingsDialogState = DialogState.CLOSING;
    setTimeout(() => (this.settingsDialogState = DialogState.CLOSED), 550);
  }

  @action public startBlether() {
    this.chatState = new ChatState(this.settings.toData(), this.hostId);

    this.screen = BletherScreen.CHAT;
  }

  @action public exitBlether() {
    this.chatState = undefined;

    this.screen = BletherScreen.HOME;
  }

  @action private loadSettings() {
    // Grab any stored settings from local storage
    const settings = localStorage.getItem(settingsKey);

    if (settings) {
      // Parse settings data and recreate settings with data
      const data = JSON.parse(settings) as SettingsData;
      this.settings.setData(data);
    } else {
      // No settings found; show settings dialog
      this.settingsDialogState = DialogState.OPEN;
    }
  }

  @action private checkRoute() {
    const url = window.location.hash.split('/');

    if (url.length !== 2) {
      return;
    }

    // Route includes a host id; save it and pass to chat state
    this.hostId = url[1];
    this.joining = true;
  }
}
