import { observer } from 'mobx-react';
import React from 'react';

import { TextMessage } from '../../model/TextMessage';
import { TimeUtils } from '../../utils/TimeUtils';
import { Icon } from '../common/icon/Icon';

import './message.scss';

interface Props {
  message: TextMessage;
}

@observer
export class Message extends React.Component<Props> {
  public render() {
    const { message } = this.props;

    const timeStr = TimeUtils.formatTimeString(message.time);

    return (
      <div className={'message'}>
        <div className={'left-col'}>
          <Icon name={message.icon} />
        </div>
        <div className={'right-col'}>
          <div className={'top-row'}>
            <div className={'name'}>{message.name}</div>
            <div className={'time'}>{timeStr}</div>
          </div>
          <div className={'bot-row'}>
            <div className={'content'} dangerouslySetInnerHTML={{ __html: message.content }}></div>
          </div>
        </div>
      </div>
    );
  }
}
