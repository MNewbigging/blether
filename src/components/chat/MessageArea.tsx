import { observer } from 'mobx-react';
import React from 'react';

import { ChatState } from '../../state/ChatState';

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
        <div dangerouslySetInnerHTML={{ __html: chatState.editorContent }}></div>
      </div>
    );
  }
}
