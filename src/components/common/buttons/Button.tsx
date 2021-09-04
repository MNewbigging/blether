import { observer } from 'mobx-react';
import React from 'react';
import { IconName } from '../../../model/Settings';
import { Icon } from '../icon/Icon';

import './button.scss';

interface Props {
  text: string;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
  icon?: IconName; // If icon is given, show that instead of text
}

export const Button: React.FC<Props> = observer(({ text, onClick, className, disabled, icon }) => {
  const disabledClass = disabled ? 'disabled' : '';
  const classNames = ['button', disabledClass, className];

  return (
    <div
      className={classNames.join(' ')}
      onClick={() => {
        if (!disabled) {
          onClick();
        }
      }}
    >
      {icon ? <Icon name={icon} interactive={false} /> : text}
    </div>
  );
});
