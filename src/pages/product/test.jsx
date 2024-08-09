import React from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

export default function RichTextEditor() {
    state = {
        editorState: EditorState.createEmpty(),
      }
    
      onEditorStateChange  = (editorState) => {
        this.setState({
          editorState,
        });
      };

    const { editorState } = this.state;
    



  return (
    <div>
    <Editor
      editorState={editorState}
      wrapperClassName="demo-wrapper"
      editorClassName="demo-editor"
      onEditorStateChange={this.onEditorStateChange}
      editorStyle={{border: '1px solid black', scrollbarWidth: 1, minHeight: 200, paddingLeft: 10 ,backgroundColor: 'white' } }
    

    />
    <textarea
      disabled
      value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
    />
  </div>
  )
}
