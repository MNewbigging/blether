import React from 'react';

import './button.scss';

interface Props {
  text: string;
  onClick: () => void;
  className?: string;
}

export const Button: React.FC<Props> = ({ text, onClick, className }) => {
  return (
    <div className={'button ' + className} onClick={() => onClick()}>
      {text}
    </div>
  );
};
