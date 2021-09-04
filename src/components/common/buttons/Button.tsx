import { observer } from 'mobx-react';
import React from 'react';

import './button.scss';

interface Props {
  text: string;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

export const Button: React.FC<Props> = observer(({ text, onClick, className, disabled }) => {
  const disabledClass = disabled ? 'disabled' : '';
  const classNames = ['button', disabledClass, className];
  console.log('button ' + text);
  return (
    <div
      className={classNames.join(' ')}
      onClick={() => {
        if (!disabled) {
          onClick();
        }
      }}
    >
      {text}
    </div>
  );
});
