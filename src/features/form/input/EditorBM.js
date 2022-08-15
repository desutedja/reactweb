import React, { useState, useEffect } from "react";
import { EditorState, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
// import { Field } from 'formik';

function Component({ label, name, ...props }) {
  const { values, setFieldValue } = props;

  // console.log(values[name])
  const blocksFromHtml = htmlToDraft(values[name]);
  const { contentBlocks, entityMap } = blocksFromHtml;

  const [contentState, setContentState] = useState(() =>
    ContentState.createFromBlockArray(contentBlocks, entityMap)
  );
  const [editorState, setEditorState] = useState(() =>
    EditorState.createWithContent(contentState)
  );

  useEffect(() => {
    console.log("content", values[name], draftToHtml(contentState));
    draftToHtml(contentState)
      ? setFieldValue(name, draftToHtml(contentState))
      : setFieldValue(name, values[name]);
  }, [contentState, name, setFieldValue, values]);

  return (
    <div className="Editor">
      {/* <Field
                id={label}
                name={name}
                placeholder={label}
                className={errors[name] && touched[name] && "error"}
                onChange={(e) => {
                    setFieldValue(name, e.target.value);
                }}
                style={{
                    display: 'none'
                }}
                {...props}
            /> */}
      <Editor
        initialContentState={contentState}
        onContentStateChange={setContentState}
        editorState={editorState}
        onEditorStateChange={setEditorState}
        toolbar={{
          options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'emoji', 'image', 'remove', 'history'],
          inline: { 
            options: [
              "bold",
              "italic",
              "underline",
            ]
          },
        }}
        // wrapperClassName='EditorWrapper'
      />
    </div>
  );
}

export default Component;
