import { observer } from 'mobx-react';
import React from 'react';

import { BletherSettings, BletherTheme } from '../../model/Settings';
import { DialogState } from '../../state/BletherState';
import { Icon } from '../common/icon/Icon';

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

        {this.renderIconPicker()}

        {this.renderThemeToggle()}
      </div>
    );
  }

  private renderIconPicker() {
    const { settings } = this.props;

    const icons = settings.getIconOptions();

    return (
      <>
        <div>Icon</div>
        <Icon name={settings.icon} interactive={false} />
        <div className={'icon-picker'}>
          {icons.map((iconName) => (
            <Icon
              key={'icon-' + iconName}
              name={iconName}
              interactive
              onClick={() => settings.setIcon(iconName)}
            />
          ))}
        </div>
      </>
    );
  }

  private renderThemeToggle() {
    const { settings } = this.props;

    // Checked if light theme
    const checked = settings.theme === BletherTheme.LIGHT;

    return (
      <>
        <div>Theme</div>
        <label className={'switch'}>
          <input type={'checkbox'} checked={checked} onChange={() => settings.toggleTheme()} />
          <span className={'slider'}></span>
        </label>
      </>
    );
  }
}