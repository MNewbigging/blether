import { observer } from 'mobx-react';
import React from 'react';
import { IconName } from '../../../model/Settings';

import './icon.scss';

interface Props {
  name: IconName;
  interactive?: boolean;
  onClick?: () => void;
}

export const Icon: React.FC<Props> = observer(({ name, interactive, onClick }) => {
  const isInteractive = interactive ?? false;
  const interactiveClass = isInteractive ? 'interactive' : '';
  const classNames = ['icon', name, interactiveClass];

  let baseUrl = window.location.origin;
  if (baseUrl.includes('localhost')) {
    baseUrl += '/dist/icons/';
  } else {
    baseUrl += '/blether/icons/';
  }

  console.log('image base path: ' + baseUrl);

  return (
    <div
      className={classNames.join(' ')}
      style={{ backgroundImage: `url(${baseUrl}` + name + '.png' }}
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
    ></div>
  );
});
