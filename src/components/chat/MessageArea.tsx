import { observer } from 'mobx-react';
import React from 'react';

import { ChatState } from '../../state/ChatState';
import { Message } from './Message';

import './message-area.scss';

interface Props {
  chatState: ChatState;
}
@observer
export class MessageArea extends React.Component<Props> {
  public render() {
    const { chatState } = this.props;

    const theme = chatState.userSettings.theme;
    const classNames = ['message-area', 'main-ui', theme];

    return (
      <div className={classNames.join(' ')}>
        {chatState.messageHistory.map((msg, idx) => (
          <Message key={'msg-' + idx} message={msg} />
        ))}
      </div>
    );
  }
}
