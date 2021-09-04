import { observer } from 'mobx-react';
import React from 'react';

import { BletherSettings, BletherTheme } from '../../model/Settings';
import { DialogState } from '../../state/BletherState';
import { Icon } from '../common/icon/Icon';

import './settings-dialog.scss';

interface Props {
  dialogState: DialogState;
  settings: BletherSettings;
  onSave: () => void;
}

@observer
export class SettingsDialog extends React.Component<Props> {
  public render() {
    const { dialogState, onSave } = this.props;

    return (
      <div className={'settings-dialog ' + dialogState}>
        <div className={'title'}>Settings</div>

        {this.renderNameInput()}

        {this.renderIconPicker()}

        {this.renderThemeToggle()}

        <button className={'save-button'} onClick={() => onSave()}>
          Save
        </button>
      </div>
    );
  }

  private renderNameInput() {
    const { settings } = this.props;

    return (
      <div className={'setting name-input'}>
        <div>Name</div>
        <input
          type={'text'}
          value={settings.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => settings.setName(e.target.value)}
        />
      </div>
    );
  }

  private renderIconPicker() {
    const { settings } = this.props;

    const icons = settings.getIconOptions();

    return (
      <div className={'setting icon-picker'}>
        <div className={'current-icon'}>
          <div>Icon</div>
          <Icon name={settings.icon} interactive={false} />
        </div>

        <div className={'icons-select'}>
          {icons.map((iconName) => (
            <Icon
              key={'icon-' + iconName}
              name={iconName}
              interactive
              onClick={() => settings.setIcon(iconName)}
            />
          ))}
        </div>
      </div>
    );
  }

  private renderThemeToggle() {
    const { settings } = this.props;

    // Checked if light theme
    const checked = settings.theme === BletherTheme.LIGHT;

    return (
      <div className={'setting theme-toggle'}>
        <div>dark</div>
        <label className={'switch'}>
          <input type={'checkbox'} checked={checked} onChange={() => settings.toggleTheme()} />
          <span className={'slider'}></span>
        </label>
        <div>light</div>
      </div>
    );
  }
}
