import { observer } from 'mobx-react';
import React from 'react';

import { ChatState } from '../../state/ChatState';
import { MessagePanel } from './MessagePanel';
import { Sidebar } from './Sidebar';
import { Toast } from '../common/toast/Toast';

import './chat-screen.scss';

interface Props {
  chatState: ChatState;
  onExit: () => void;
}

@observer
export class ChatScreen extends React.Component<Props> {
  public render() {
    const { chatState, onExit } = this.props;

    return (
      <div className={'chat-screen'}>
        <Toast toastState={chatState.toastState} theme={chatState.userSettings.theme} />
        <Sidebar chatState={chatState} onExit={() => onExit()} />
        <MessagePanel chatState={chatState} />
      </div>
    );
  }
}
