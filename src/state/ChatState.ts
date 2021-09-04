import { action, observable } from 'mobx';
import { BletherSettings } from '../model/Settings';

export class ChatState {
  @observable public sidebarOpen = true;
  public userSettings: BletherSettings;

  constructor(settings: BletherSettings) {
    this.userSettings = settings;
  }

  @action public toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
