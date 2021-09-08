import React from 'react';

import { UserMessage } from '../../model/UserMessage';

import './message.scss';

interface Props {
  message: UserMessage;
}

export class Message extends React.Component<Props> {
  public render() {
    const { message } = this.props;

    return (
      <div className={'message'}>
        <div dangerouslySetInnerHTML={{ __html: message.content }}></div>
      </div>
    );
  }
}
