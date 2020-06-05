import React, { useState, useEffect } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';

import Input from './Input';

function Component({
    label, name, inputValue, setInputValue,
}) {
    const [editorState, setEditorState] = useState(
        () => EditorState.createEmpty(),
    );
    // const [raw, setRaw] = useState({});

    // useEffect(() => {
    //     setRaw(convertToRaw(editorState.getCurrentContent()));
    // }, [editorState]);

    const [contentState, setContentState] = useState({});

    return (
        <>
            <div className="EditorContainer">
                <p className="Input-label">{label}</p>
                <div className="Editor">
                    <Editor
                        initialContentState={contentState}
                        onContentStateChange={setContentState}
                        editorState={editorState}
                        onEditorStateChange={setEditorState}
                    />
                </div>
            </div>
            <Input hidden label={label} name={name} type="textarea"
            inputValue={draftToHtml(contentState)} />
        </>
    )
}

export default Component;