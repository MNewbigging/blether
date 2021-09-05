import React from 'react';
import JoditReact from 'jodit-react-ts';
import 'jodit/build/jodit.min.css';

import { ChatState } from '../../state/ChatState';

import './message-input.scss';

interface Props {
  chatState: ChatState;
}

export class MessageInput extends React.Component<Props> {
  public render() {
    const { chatState } = this.props;

    const config = {
      minHeight: 120,
      maxHeight: 200,
      showXPathInStatusbar: false,
      buttons:
        'bold,italic,underline,strikethrough,superscript,subscript,ul,ol,image,video,file,link,undo,redo',
    };

    return (
      <div className={'message-input'}>
        <JoditReact
          onChange={(content: string) => chatState.setMessageText(content)}
          config={config}
        />
      </div>
    );
  }
}
