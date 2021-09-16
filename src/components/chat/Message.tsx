import React from 'react';

import { UserMessage } from '../../model/UserMessage';
import { Icon } from '../common/icon/Icon';

import './message.scss';

interface Props {
  message: UserMessage;
}

export class Message extends React.Component<Props> {
  public render() {
    const { message } = this.props;

    const timeStr = this.getTimeString();

    return (
      <div className={'message'}>
        <div className={'top-row'}>
          <Icon name={message.icon} />
          <div className={'name'}>{message.name}</div>
          <div className={'time'}>{timeStr}</div>
        </div>
        <div className={'bot-row'} dangerouslySetInnerHTML={{ __html: message.content }}></div>
      </div>
    );
  }

  private getTimeString() {
    const { message } = this.props;

    const time = new Date(JSON.parse(message.time));
    const hours = this.validateTime(time.getHours().toString());
    const mins = this.validateTime(time.getMinutes().toString());

    return hours + ':' + mins;
  }

  private validateTime(timeStr: string) {
    // If it has length of 2, it's fine
    if (timeStr.length === 2) {
      return timeStr;
    }

    // Otherwise add 0 at start
    return '0' + timeStr;
  }
}
