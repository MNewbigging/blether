import { observer } from 'mobx-react';
import React from 'react';

import { BletherState } from '../../state/BletherState';
import { SettingsDialog } from './SettingsDialog';

import './home-screen.scss';

interface Props {
  bState: BletherState;
}
@observer
export class HomeScreen extends React.Component<Props> {
  public render() {
    const { bState } = this.props;

    return (
      <div className={'home-screen'}>
        <div className={'logo'}>blether</div>
        <SettingsDialog
          dialogState={bState.settingsDialogState}
          settings={bState.settings}
          onSave={() => bState.saveSettings()}
        />
      </div>
    );
  }
}
