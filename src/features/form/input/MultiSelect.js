import React from 'react';
import useAutocomplete from '@material-ui/lab/useAutocomplete';
import NoSsr from '@material-ui/core/NoSsr';
import { FiX, FiCheck } from 'react-icons/fi';

function MultiSelectInput({
    placeholder, options, defaultValue = [], onBlur = () => { }, onInputChange = () => { },
    onChange = () => { }, ...props
}) {
    const { setFieldValue, name, fixedName } = props;

    const onValueChange = (e, val) => {
        onChange(e, val);
        setFieldValue && setFieldValue(name, val);
        setFieldValue && setFieldValue(fixedName, val);
    }

    const {
        getRootProps,
        getInputProps,
        getTagProps,
        getListboxProps,
        getOptionProps,
        groupedOptions,
        inputValue,
        value,
        setAnchorEl,
    } = useAutocomplete({
        id: 'multiselectinput',
        defaultValue: defaultValue,
        multiple: true,
        options: options,
        onInputChange: onInputChange,
        onChange: onValueChange,
        getOptionLabel: (option) => option.label,
        getOptionSelected: (option, value) => option.value === value.value,
        getOptionDisabled: (option) => option.value === 0,
    });

    function Tag({ label, onDelete, ...props }) {
        return <div {...props} className="MultiSelectItem">
            <span>{label}</span>
            <FiX onClick={onDelete} />
        </div>
    }

    return (
        <NoSsr>
            <div>
                <div {...getRootProps()}>
                    <div className="Input-container">
                        <input {...getInputProps()} placeholder={placeholder} />
                    </div>
                    <ul className="MultiSelectDropDown" {...getListboxProps()}>
                        {groupedOptions.length === 0 ?
                            (inputValue.length > 0 ? <li><span>No Result</span></li> : null) :
                            groupedOptions.map((option, index) =>
                                <li style={{ display: 'flex' }} {...getOptionProps({ index, option })} >
                                    <span>{option.label}</span>
                                    <FiCheck size="20" />
                                </li>
                            )}
                    </ul>
                    <div ref={setAnchorEl} className={"MultiSelectItemWrapper"}>
                        {value.map((option, index) => (
                            <Tag label={option.label} {...getTagProps({ index })} />
                        ))}
                    </div>
                </div>
            </div>
        </NoSsr>
    );
}

export default MultiSelectInput;
