import { observer } from 'mobx-react';
import React from 'react';

import { BletherScreen, BletherState } from '../state/BletherState';
import { ChatScreen } from './chat/ChatScreen';
import { HomeScreen } from './home/HomeScreen';

@observer
export class Blether extends React.Component {
  private readonly bState = new BletherState();

  public render() {
    if (this.bState.screen === BletherScreen.CHAT && this.bState.chatState) {
      return (
        <ChatScreen chatState={this.bState.chatState} onExit={() => this.bState.exitBlether()} />
      );
    }

    return <HomeScreen bState={this.bState} />;
  }
}
