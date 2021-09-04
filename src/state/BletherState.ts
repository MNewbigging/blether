import { action, observable } from 'mobx';
import { BletherSettings, SettingsData } from '../model/Settings';

export enum DialogState {
  OPEN = 'open',
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

  constructor() {
    this.loadSettings();
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
}
