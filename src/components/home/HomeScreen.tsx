import { observer } from 'mobx-react';
import React from 'react';

import { BletherState } from '../../state/BletherState';
import { SettingsDialog } from './SettingsDialog';

import './home-screen.scss';
import { Icon } from '../common/icon/Icon';
import { Button } from '../common/buttons/Button';

interface Props {
  bState: BletherState;
}
@observer
export class HomeScreen extends React.Component<Props> {
  public render() {
    const { bState } = this.props;

    const icon = bState.settings.icon;
    const name = bState.settings.name;

    return (
      <div className={'home-screen'}>
        <div className={'logo'}>blether</div>

        <div className={'name'}>
          <Icon name={icon} interactive={false} />
          <div>{name}</div>
        </div>

        <div className={'settings'} onClick={() => bState.openSettings()}>
          settings
        </div>

        <Button text={'start a blether'} onClick={() => {}} />

        <SettingsDialog
          dialogState={bState.settingsDialogState}
          settings={bState.settings}
          onSave={() => bState.saveSettings()}
        />
      </div>
    );
  }
}
