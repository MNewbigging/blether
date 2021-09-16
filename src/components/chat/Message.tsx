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

    const time = new Date(JSON.parse(message.time));
    const hours = time.getHours();
    const mins = time.getMinutes();
    const timeStr = hours + ':' + mins;

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
}
