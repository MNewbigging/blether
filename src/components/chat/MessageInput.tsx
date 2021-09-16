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
  componentDidMount() {
    const { chatState } = this.props;

    chatState.editorState = EditorState.moveFocusToEnd(chatState.editorState);
  }

  public render() {
    const { chatState } = this.props;

    const theme = chatState.userSettings.theme;

    return (
      <div className={'message-input main-ui ' + theme}>
        <div className={'editor-container'}>
          <Editor
            wrapperClassName={'main-ui editor-wrapper ' + theme}
            toolbarClassName={'toolbar accent-ui ' + theme}
            editorClassName={'secondary-ui editor ' + theme}
            editorState={chatState.editorState}
            onEditorStateChange={(es: EditorState) => chatState.setEditorState(es)}
            toolbar={EditorConfig}
          />
        </div>
      </div>
    );
  }
}
