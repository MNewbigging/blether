import { observer } from 'mobx-react';
import React from 'react';

import { ToastState } from '../../../state/ToastState';

import './toast.scss';

interface Props {
  toastState: ToastState;
  theme: string;
}

@observer
export class Toast extends React.Component<Props> {
  public render() {
    const { toastState, theme } = this.props;

    const classNames = ['toast', toastState.toastStatus, 'accent-ui', theme];

    return (
      <div className={classNames.join(' ')} onAnimationEnd={toastState.hideToast}>
        {toastState.toastMessage}
      </div>
    );
  }
}
