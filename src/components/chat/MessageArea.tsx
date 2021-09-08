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

    return (
      <div className={'message-area'}>
        {chatState.messageHistory.map((msg) => (
          <Message message={msg} />
        ))}
      </div>
    );
  }
}
