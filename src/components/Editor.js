import React, { useState } from 'react';
import { EditorState, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';

import Input from './Input';
import htmlToDraft from 'html-to-draftjs';

function Component({
    label, name, inputValue = "", setInputValue,
}) {
    const blocksFromHtml = htmlToDraft(inputValue);
    const { contentBlocks, entityMap } = blocksFromHtml;

    const [contentState, setContentState] = useState(
        () => ContentState.createFromBlockArray(contentBlocks, entityMap)
    );
    const [editorState, setEditorState] = useState(
        () => EditorState.createWithContent(contentState)
    );

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
                inputValue={inputValue ? inputValue : draftToHtml(contentState)} />
        </>
    )
}

export default Component;