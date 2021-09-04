import { observer } from 'mobx-react';
import React from 'react';

import { BletherSettings } from '../../model/Settings';
import { DialogState } from '../../state/BletherState';

import './settings-dialog.scss';

interface Props {
  dialogState: DialogState;
  settings: BletherSettings;
}

@observer
export class SettingsDialog extends React.Component<Props> {
  public render() {
    const { dialogState, settings } = this.props;

    return (
      <div className={'settings-dialog ' + dialogState}>
        <div>Settings</div>

        <div>Name</div>
        <input
          type={'text'}
          value={settings.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => settings.setName(e.target.value)}
        />

        <div>Icon</div>

        <div>Theme</div>
      </div>
    );
  }
}
