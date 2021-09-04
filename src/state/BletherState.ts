/**
 * Top level state class; determines which screen to show and holds sub classes for
 * screen states.
 */

import { observable } from 'mobx';
import { BletherSettings, SettingsData } from '../model/Settings';

export enum BletherScreen {
  HOME = 'home',
  CHAT = 'chat',
}

const settingsKey = 'SETTINGS';

export class BletherState {
  @observable public screen = BletherScreen.HOME;
  @observable public settings = new BletherSettings();

  constructor() {
    this.loadSettings();
  }

  private loadSettings() {
    // Grab any stored settings from local storage
    const settings = localStorage.getItem(settingsKey);

    if (settings) {
      // Parse settings data and recreate settings with data
      const data = JSON.parse(settings) as SettingsData;
      this.settings.setData(data);
    }
  }
}
