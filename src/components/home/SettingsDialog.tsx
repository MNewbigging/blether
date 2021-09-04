import { observer } from 'mobx-react';
import React from 'react';

import { BletherSettings, BletherTheme } from '../../model/Settings';
import { DialogState } from '../../state/BletherState';
import { Button } from '../common/buttons/Button';
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
      <>
        <div className={'dialog-overlay ' + dialogState}></div>
        <div className={'settings-dialog ' + dialogState}>
          {this.renderNameInput()}

          {this.renderIconPicker()}

          {this.renderThemeToggle()}

          <Button text={'save'} className={'save-button'} onClick={() => onSave()} />
        </div>
      </>
    );
  }

  private renderNameInput() {
    const { settings } = this.props;

    return (
      <div className={'setting name-input'}>
        <div className={'label'}>Name</div>
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
          <div className={'label'}>Icon</div>
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
        <div>dark mode</div>
        <label className={'switch'}>
          <input type={'checkbox'} checked={checked} onChange={() => settings.toggleTheme()} />
          <span className={'slider'}></span>
        </label>
        <div>light mode</div>
      </div>
    );
  }
}
