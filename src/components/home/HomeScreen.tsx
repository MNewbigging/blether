import { observer } from 'mobx-react';
import React from 'react';

import { BletherState } from '../../state/BletherState';
import { SettingsDialog } from './SettingsDialog';
import { Icon } from '../common/icon/Icon';
import { Button } from '../common/buttons/Button';

import './home-screen.scss';

interface Props {
  bState: BletherState;
}

@observer
export class HomeScreen extends React.Component<Props> {
  public render() {
    const { bState } = this.props;

    const theme = bState.settings.theme;
    const icon = bState.settings.icon;
    const name = bState.settings.name;

    const btnText = bState.joining ? 'join blether' : 'start a blether';

    return (
      <div className={'home-screen main-ui ' + theme}>
        <div className={'logo main-ui'}>blether</div>

        <div className={'icon-name'}>
          <Icon name={icon} interactive={false} />
          <div className={'name'}>{name}</div>
        </div>

        <Button className={'start-button'} text={btnText} onClick={() => bState.startBlether()} />

        <div className={'settings'} onClick={() => bState.openSettings()}>
          settings
        </div>

        <SettingsDialog
          dialogState={bState.settingsDialogState}
          settings={bState.settings}
          onSave={() => bState.saveSettings()}
        />
      </div>
    );
  }
}
