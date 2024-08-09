import React, { useState } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

export default function RichTextEditor() {

  // 创建用来保存Editor标识的标签对象的容器
  
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
  };

  //返回输入的html格式的文本

  const getDetail = () => draftToHtml(convertToRaw(editorState.getCurrentContent()));

  return (
    <div>
      <Editor
        editorState={editorState}
        wrapperClassName="demo-wrapper"
        editorClassName="demo-editor"
        onEditorStateChange={onEditorStateChange}
        editorStyle={{border: '1px solid black', minHeight: 200, paddingLeft: 10, backgroundColor: 'white'}}
      />
      <textarea
        disabled
        // 或者当前的内容在作翻译
        value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
      />
    </div>
  );
}