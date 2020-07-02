import React, { useState, useEffect, useRef } from 'react';
import { FiChevronDown, FiX } from 'react-icons/fi';
import MoonLoader from "react-spinners/MoonLoader";

import { storageRef } from '../firebase';

const MultiSelectItem = ({ value, onClickDelete }) => {
    return (
        <div className="MultiSelectItem">
            {value}
            <FiX className="MultiSelectItem-delete" onClick={onClickDelete} />
        </div>
    )
}

function Component({
    label = "", actionlabels = {}, placeholder = null, compact, name, optional = true,
    type = "text", rows = 2, options = [],
    inputValue, setInputValue, icon, onClick, onFocus, onBlur,
    hidden, max, min, disabled, isValidate = false, validationMsg, accept = "image/*"
}) {
    const [value, setValue] = useState(inputValue ? inputValue : "");
    const [uploading, setUploading] = useState(false);
    let uploader = useRef();

    useEffect(() => {
        inputValue && setValue(inputValue);
    }, [inputValue])

    const renderInput = type => {
        switch (type) {
            case 'multiselect':
                return <div className="MultiSelect" onClick={inputValue.length === 0 ? onClick : undefined}>
                    {inputValue.length > 0 ? inputValue.map((el, index) =>
                        <MultiSelectItem
                            key={index}
                            value={el.value}
                            onClickDelete={el.onClickDelete} />) :
                        <p style={{ color: 'grey' }}>
                            {label}
                        </p>
                    }
                </div>;

            case 'textarea': return <textarea
                type={type}
                id={label}
                name={name ? name : label.toLowerCase().replace(/ /g, '_')}
                required={!optional}
                placeholder={label}
                rows={rows}
                value={inputValue === '' ? '' : value}
                onChange={(e) => {
                    setValue(e.target.value);
                    setInputValue && setInputValue(e.target.value);
                }}
            />;

            case 'select': return <div className="Input-container">
                <select
                    disabled={disabled}
                    style={{
                        color: !value && 'grey'
                    }}
                    type={type}
                    id={label}
                    name={name ? name : label.toLowerCase().replace(/ /g, '_')}
                    required={!optional}
                    placeholder={placeholder == null ? label : placeholder}
                    rows={rows}
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value);
                        setInputValue && setInputValue(e.target.value);
                    }}
                    onClick={onClick}
                >
                    {!inputValue && <option value="">{label}</option>}
                    {options.map(el =>
                        <option key={el.value} value={el.value}>{el.label}</option>
                    )}
                </select>
                <div className="InputIcon">
                    <FiChevronDown />
                </div>
            </div>;

            case 'radio': return (
                <div className="row">
                    {options.map(el => (
                        <div className="col-6">
                            <div className="form-check">
                                {inputValue === el.value ?
                                    <input className="form-check-input" type="radio" name={label} id={el.label} value={el.value} checked /> :
                                    <input className="form-check-input" type="radio" name={label} id={el.label} value={el.value} />
                                }
                               
                                <label className="form-check-label m-0 ml-2" for={el.label}>
                                    {el.label}
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
            )

            case 'file': return <div className="Input-container">
                {uploading && <div className="InputIcon">
                    <MoonLoader
                        size={14}
                        color={"grey"}
                        loading={uploading}
                    />
                </div>}
                <input
                    type="url"
                    id={label}
                    name={name ? name : label.toLowerCase().replace(/ /g, '_')}
                    required={!optional}
                    placeholder={label}
                    size="40"
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value);
                        setInputValue && setInputValue(e.target.value);
                    }}
                    onClick={onClick}
                />
                <input
                    ref={uploader}
                    accept="image/*"
                    type="file"
                    id={label}
                    name="uploader"
                    required={false}
                    onChange={async (e) => {
                        let file = uploader.current.files[0];

                        setValue('Uploading file...');
                        setInputValue && setInputValue('Uploading file...');
                        setUploading(true);

                        let ref = storageRef.child('building_logo/' + Date.now() + '-' + file.name);
                        await ref.put(file).then(function (snapshot) {
                            console.log(snapshot, 'File uploaded!');

                            snapshot.ref.getDownloadURL().then(url => {
                                setValue(url);
                                setInputValue && setInputValue(url);
                            });

                            setUploading(false);
                        })
                    }}
                    onClick={onClick}
                />
            </div>;

            default:
                return (
                    <div className="Input-container">
                        {icon && <div className="InputIcon">
                            {icon}
                        </div>}
                        <input
                            disabled={disabled}
                            type={type}
                            id={label}
                            name={name ? name : label.toLowerCase().replace(/ /g, '_')}
                            required={!optional}
                            placeholder={placeholder === null ? label : placeholder}
                            min={min}
                            max={max}
                            value={value ? value : type === "button" ? label : ""}
                            onBlur={onBlur}
                            onChange={(e) => {
                                // console.log(e.target.value);
                                if (type === 'url') {
                                    setValue('http://' + e.target.value.replace('http://', ''));
                                    setInputValue && setInputValue('http://' + e.target.value.replace('http://', ''));
                                } else {
                                    !onClick && setValue(e.target.value);
                                    setInputValue && setInputValue(e.target.value);
                                }
                            }}
                            onClick={onClick}
                            onFocus={onFocus}
                            list={type === 'searchable' ? ('options-' + label) : null}
                        />
                        {type === 'searchable' &&
                            <datalist id={"options-" + label}>
                                {options.map(el =>
                                    <option key={el.value} value={el.label} />
                                )}
                            </datalist>}
                    </div>
                )
        }
    }

    return (options.length !== 0 || type !== 'select') && (
        <div className={"Input"
            + (type === "textarea" ? " textarea" : "")
            + (type === "select" ? " select" : "")
            + (type === "multiselect" ? " multiselect" : "")
            + (hidden ? " hidden" : "")
        }>
            {!compact && <>
                <div style={{ display: 'flex' }} >
                    <label className="Input-label" htmlFor={label}>
                        {label}
                    </label>
                    {Object.keys(actionlabels).map(action =>
                        // eslint-disable-next-line jsx-a11y/anchor-is-valid
                        <a key={action} style={{ margin: '4px' }}
                            href="#" onClick={actionlabels[action]} >{action}</a>
                    )}
                </div>
            </>}

            {renderInput(type)}
            {isValidate && <span className="validation-error">{ validationMsg }</span>}
        </div>
    )
}

export default Component;
