import React, { useState, useEffect } from 'react';
import { EditorState, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

function Component({
    label, name, ...props
}) {
    const { values, setFieldValue } = props;

    // console.log(values[name])
    const blocksFromHtml = htmlToDraft(values[name]);
    const { contentBlocks, entityMap } = blocksFromHtml;

    const [contentState, setContentState] = useState(
        () => ContentState.createFromBlockArray(contentBlocks, entityMap)
    );
    const [editorState, setEditorState] = useState(
        () => EditorState.createWithContent(contentState)
    );

    useEffect(() => {
        setFieldValue(name, draftToHtml(contentState));
    }, [contentState, name, setFieldValue])

    return (
                <div className="Editor">
                    <Editor
                        initialContentState={contentState}
                        onContentStateChange={setContentState}
                        editorState={editorState}
                        onEditorStateChange={setEditorState}
                        wrapperClassName='EditorWrapper'
                    />
                </div>
    )
}

export default Component;