import { observer } from 'mobx-react';
import React from 'react';
import { IconName } from '../../../model/Settings';

import './icon.scss';

interface Props {
  name: IconName;
  interactive: boolean;
  onClick?: () => void;
}

export const Icon: React.FC<Props> = observer(({ name, interactive, onClick }) => {
  const interactiveClass = interactive ? 'interactive' : '';
  const classNames = ['icon', name, interactiveClass];

  return (
    <div
      className={classNames.join(' ')}
      style={{ backgroundImage: 'url(src/assets/icons/' + name + '.png' }}
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
    ></div>
  );
});
