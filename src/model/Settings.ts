import { action, observable } from 'mobx';

export enum IconName {
  BEAR = 'bear',
  BUFFALO = 'buffalo',
  CHICK = 'chick',
  CHICKEN = 'chicken',
  COW = 'cow',
  CROCODILE = 'crocodile',
  DOG = 'dog',
  DUCK = 'duck',
  ELEPHANT = 'elephant',
  FROG = 'frog',
  GIRAFFE = 'giraffe',
  GOAT = 'goat',
  HIPPO = 'hippo',
  HORSE = 'horse',
  MONKEY = 'monkey',
  MOOSE = 'moose',
  NARWHAL = 'narwhal',
  OWL = 'owl',
  PANDA = 'panda',
  RABBIT = 'rabbit',
  RHINO = 'rhino',
  SLOTH = 'sloth',
  SNAKE = 'snake',
  WALRUS = 'walrus',
  WHALE = 'whale',
  ZEBRA = 'zebra',
}

export enum BletherTheme {
  LIGHT = 'light',
  DARK = 'dark',
}

export interface SettingsData {
  name: string;
  icon: IconName;
  theme: BletherTheme;
}

export class BletherSettings {
  @observable public name = '';
  @observable public icon = IconName.BEAR;
  @observable public theme = BletherTheme.LIGHT;

  constructor() {
    // TODO - pick a random default icon
  }

  public getIconOptions() {
    return Object.values(IconName);
  }

  @action public setData(settingsData: SettingsData) {
    this.name = settingsData.name;
    this.icon = settingsData.icon;
    this.theme = settingsData.theme;
  }

  @action public setName(name: string) {
    this.name = name;
  }

  @action public setIcon(iconName: IconName) {
    this.icon = iconName;
  }

  @action public toggleTheme() {
    this.theme = this.theme === BletherTheme.LIGHT ? BletherTheme.DARK : BletherTheme.LIGHT;
  }
}
