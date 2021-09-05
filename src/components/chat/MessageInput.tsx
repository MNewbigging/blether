import React from 'react';

import { ChatState } from '../../state/ChatState';

import './message-input.scss';

interface Props {
  chatState: ChatState;
}

export class MessageInput extends React.Component<Props> {
  public render() {
    const { chatState } = this.props;

    return (
      <div className={'message-input'}>
        {/* <JoditEditor
          value={chatState.messageText}
          onBlur={(text: string) => chatState.setMessageText(text)}
        /> */}
      </div>
    );
  }
}
