import { observer } from 'mobx-react';
import React from 'react';

import { BletherScreen, BletherState } from '../state/BletherState';
import { HomeScreen } from './home/HomeScreen';

/**
 * Higher order component which decides which screen to show
 */

@observer
export class Blether extends React.Component {
  private readonly bState = new BletherState();

  public render() {
    if (this.bState.screen === BletherScreen.HOME) {
      return <HomeScreen />;
    }

    return <div>blether</div>;
  }
}
