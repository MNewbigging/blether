import { IconName } from './Settings';

export interface TextMessage {
  content: string;
  time: string;
  name: string;
  icon: IconName;
}
