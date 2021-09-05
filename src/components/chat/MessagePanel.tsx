import { observer } from 'mobx-react';
import React from 'react';

import { ChatState } from '../../state/ChatState';
import { MessageArea } from './MessageArea';
import { MessageInput } from './MessageInput';

import './message-panel.scss';

interface Props {
  chatState: ChatState;
}

@observer
export class MessagePanel extends React.Component<Props> {
  public render() {
    const { chatState } = this.props;

    return (
      <div className={'message-panel'}>
        <MessageArea />
        <MessageInput chatState={chatState} />
      </div>
    );
  }
}
