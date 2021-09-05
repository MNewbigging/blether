import { action, observable } from 'mobx';
import { BletherSettings } from '../model/Settings';

export class ChatState {
  @observable public sidebarOpen = true;
  @observable public messageText = 'blether away...';
  public userSettings: BletherSettings;

  constructor(settings: BletherSettings) {
    this.userSettings = settings;
  }

  @action public toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  @action public setMessageText(text: string) {
    this.messageText = text;
  }

  public sendMessage() {
    console.log(this.messageText);
  }
}
