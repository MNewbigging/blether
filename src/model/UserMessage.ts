import { IconName } from './Settings';

export interface UserMessage {
  content: string;
  time: string;
  name: string;
  icon: IconName;
}
