import { EditorState } from 'draft-js';
import { observer } from 'mobx-react';
import React from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import EditorConfig from '../../model/EditorConfig';
import { ChatState } from '../../state/ChatState';

import './message-input.scss';

interface Props {
  chatState: ChatState;
}

@observer
export class MessageInput extends React.Component<Props> {
  public render() {
    const { chatState } = this.props;

    return (
      <div className={'message-input'}>
        <Editor
          wrapperClassName={'editor-wrapper'}
          toolbarClassName={'toolbar'}
          editorClassName={'editor'}
          editorState={chatState.editorState}
          onEditorStateChange={(es: EditorState) => chatState.setEditorState(es)}
          toolbar={EditorConfig}
        />
      </div>
    );
  }
}
