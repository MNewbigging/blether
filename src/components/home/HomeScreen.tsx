import { observer } from 'mobx-react';
import React from 'react';

import './home-screen.scss';

@observer
export class HomeScreen extends React.Component {
  public render() {
    return (
      <div className={'home-screen'}>
        <div className={'logo'}>blether</div>
      </div>
    );
  }
}
