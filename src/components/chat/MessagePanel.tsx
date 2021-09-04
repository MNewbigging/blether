import { observer } from 'mobx-react';
import React from 'react';

import { ChatState } from '../../state/ChatState';

import './message-panel.scss';

interface Props {
  chatState: ChatState;
}

@observer
export class MessagePanel extends React.Component<Props> {
  public render() {
    return <div className={'message-panel'}></div>;
  }
}
