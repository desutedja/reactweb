import React, { } from 'react';

import TextInput from './Text';
import MultiSelectInput from './MultiSelect';
import RadioInput from './Radio';
import FileInput from './File';

function Input({ optional = false, ...props }) {
    const {
        label = "", actionlabels = {}, compact, type = "text", hidden, name
    } = props;
    const fixedName = name ? name : label.toLowerCase().replace(/ /g, '_');

    const renderInput = type => {
        switch (type) {
            case 'multiselect': return <MultiSelectInput name={fixedName} {...props} />;
            case 'radio': return <RadioInput name={fixedName} {...props} />;
            case 'file': return <FileInput name={fixedName} {...props} />;
            case 'textarea': return <TextInput as="textarea" name={fixedName} {...props} />;
            case 'select':
            default:
                return <TextInput name={fixedName} {...props} />;
        }
    }

    return (
        <div className={"Input"
            + (type === "textarea" ? " textarea" : "")
            + (type === "select" ? " select" : "")
            + (type === "multiselect" ? " multiselect" : "")
            + (hidden ? " hidden" : "")
        }>
            {!compact && <>
                <div style={{ display: 'flex' }}>
                    <div style={{ display: 'flex' }}>
                        <label className="Input-label" htmlFor={label}>
                            {label}
                        </label>
                        {optional && <span style={{
                            marginLeft: 4,
                            color: 'grey',
                        }}>(optional)</span>}
                    </div>
                    {Object.keys(actionlabels).map(action =>
                        // eslint-disable-next-line jsx-a11y/anchor-is-valid
                        <a key={action} style={{ margin: '4px' }}
                            href="#" onClick={actionlabels[action]} >{action}</a>
                    )}
                </div>
            </>}
            {renderInput(type)}
        </div>
    )
}

export default Input;
