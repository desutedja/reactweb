import React from 'react';
import useAutocomplete from '@material-ui/lab/useAutocomplete';
import NoSsr from '@material-ui/core/NoSsr';
import { FiX, FiCheck } from 'react-icons/fi';

function MultiSelectInput({ 
    placeholder, options, hint, onInputChange = () => {}, onChange = () => {}, ...props
}) {
    const { setFieldValue, name, fixedName } = props;

    const onValueChange = (e, val) => {
        onChange(e, val);
        setFieldValue(name, val);
        setFieldValue(fixedName, val);
    }

    const {
        getRootProps,
        getInputLabelProps,
        getInputProps,
        getTagProps,
        getListboxProps,
        getOptionProps,
        groupedOptions,
        value,
        focused,
        setAnchorEl,
    } = useAutocomplete({
        id: 'multiselectinput',
        defaultValue: [],
        multiple: true,
        options: options,
        onInputChange: onInputChange,
        onChange: onValueChange,
        getOptionLabel: (option) => option.label,
        getOptionSelected: (option, value) => option.value === value.value
    });

    function Tag({label, onDelete, ...props}) {
        return <div {...props} className="MultiSelectItem">
            <span>{label}</span>
            <FiX onClick={onDelete} />
        </div>
    }

    return (
        <NoSsr>
            <div>
                <div {...getRootProps()}>
                    {hint && <div>{hint}</div>}
                    <div ref={setAnchorEl} className={"MultiSelectItemWrapper" + (focused ? ' focused ': '')}>
                        {value.map((option, index) => (
                            <Tag label={option.label} {...getTagProps({ index })} />
                        ))}
                    </div>
                    <div className="Input-container">
                        <input {...getInputProps()} placeholder={placeholder}/>
                    </div>
                </div>
                {groupedOptions.length > 0 ? (
                    <ul className="MultiSelectDropDown" {...getListboxProps()}>
                        {groupedOptions.map((option, index) => {
                            return (<li style={{ display: 'flex' }} {...getOptionProps({ index, option })} >
                                <span>{option.label}</span>
                                <FiCheck size="20"/>
                            </li>)
                        })}
                    </ul>
                ) : null}
            </div>
        </NoSsr>
    );
}

export default MultiSelectInput;
