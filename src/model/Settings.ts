import { action, observable } from 'mobx';

export enum BletherTheme {
  LIGHT = 'light',
  DARK = 'dark',
}

export interface SettingsData {
  name: string;
  icon: string;
  theme: BletherTheme;
}

export class BletherSettings {
  @observable public name = '';
  public icon = '';
  public theme = BletherTheme.LIGHT;

  public setData(settingsData: SettingsData) {
    this.name = settingsData.name;
    this.icon = settingsData.icon;
    this.theme = settingsData.theme;
  }

  @action public setName(name: string) {
    this.name = name;
  }
}
