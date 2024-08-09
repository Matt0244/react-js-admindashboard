import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

// const RichTextEditor = forwardRef((props, ref) => {
//   const [editorState, setEditorState] = useState(EditorState.createEmpty());

const RichTextEditor = forwardRef((props, ref) => {
  
  const { detail ,onChange } = props;
  const [editorState, setEditorState] = useState(() => {
    if (detail) {
      const blocksFromHtml = htmlToDraft(detail);
      const { contentBlocks, entityMap } = blocksFromHtml;
      const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
      return EditorState.createWithContent(contentState);
    } else {
      return EditorState.createEmpty();
    }
  });

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
    onChange && onChange(draftToHtml(convertToRaw(editorState.getCurrentContent())));
  };

  const getDetail = () => draftToHtml(convertToRaw(editorState.getCurrentContent()));

  function uploadImageCallBack(file) {
    return new Promise(
      (resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://api.imgur.com/3/image');
        xhr.setRequestHeader('Authorization', 'Client-ID XXXXX');
        const data = new FormData();
        data.append('image', file);
        xhr.send(data);
        xhr.addEventListener('load', () => {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        });
        xhr.addEventListener('error', () => {
          const error = JSON.parse(xhr.responseText);
          reject(error);
        });
      }
    );
  }
  

  useImperativeHandle(ref, () => ({
    getDetail: () => {
      const detail = draftToHtml(convertToRaw(editorState.getCurrentContent()));
      console.log('getDetail called:', detail);
      return detail;

    },
    
  }), [editorState]);

  return (
    <div>
      <Editor
        editorState={editorState}
        wrapperClassName="demo-wrapper"
        editorClassName="demo-editor"
        onEditorStateChange={onEditorStateChange}
        editorStyle={{border: '1px solid black', minHeight: 200, paddingLeft: 10, backgroundColor: 'white'}}
        toolbar={{
          inline: { inDropdown: false },
          list: { inDropdown: false },
          textAlign: { inDropdown: false },
          link: { inDropdown: false },
          history: { inDropdown: false },
          image: { uploadCallback: uploadImageCallBack, alt: { present: true, mandatory: true } },
        }}
      />
      <textarea
        disabled
        value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
      />
    </div>
  );
});

export default RichTextEditor;