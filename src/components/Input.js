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
    label = "", placeholder = null, compact, name, optional = true,
    type = "text", rows = 2, options = [],
    inputValue, setInputValue, icon, onClick,
    hidden, max, min, disabled
}) {
    const [value, setValue] = useState(inputValue ? inputValue : "");
    const [uploading, setUploading] = useState(false);

    let uploader = useRef();

    useEffect(() => {
        inputValue && setValue(inputValue);
    }, [inputValue])

    const renderInput = type => {
        switch (type) {
            case 'multiselect': return <div
                className="MultiSelect"
                onClick={inputValue.length === 0 ? onClick : undefined}
            >
                {inputValue.length > 0 ? inputValue.map((el, index) => <MultiSelectItem
                    key={index}
                    value={el.value}
                    onClickDelete={el.onClickDelete} />) :
                    <p style={{
                        color: 'grey'
                    }}>{label}</p>}
            </div>;

            case 'textarea': return <textarea
                className="Input-input"
                type={type}
                id={label}
                name={name ? name : label.toLowerCase().replace(/ /g, '_')}
                required={!optional}
                placeholder={label}
                rows={rows}
                value={value}
                onChange={(e) => {
                    setValue(e.target.value);
                    setInputValue && setInputValue(e.target.value);
                }}
            />;

            case 'select': return <div className="Input-container">
                <select
                    style={{
                        color: !value && 'grey'
                    }}
                    className="Input-input"
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

            case 'file': return <div className="Input-container">
                {uploading && <div className="InputIcon">
                    <MoonLoader
                        size={14}
                        color={"grey"}
                        loading={uploading}
                    />
                </div>}
                <input
                    className="Input-input"
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
                    className="Input-input"
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

            default: return <div className="Input-container">
                {icon && <div className="InputIcon">
                    {icon}
                </div>}
                <input
                    disabled={disabled}
                    className="Input-input"
                    type={type}
                    id={label}
                    name={name ? name : label.toLowerCase().replace(/ /g, '_')}
                    required={!optional}
                    placeholder={label}
                    maxLength="30"
                    size="30"
                    min={min}
                    max={max}
                    value={value ? value : type === "button" ? label : ""}
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
                    list={type === 'searchable' ? ('options-' + label) : null}
                />
                {type === 'searchable' &&
                    <datalist id={"options-" + label}>
                        {options.map(el =>
                            <option key={el.value} value={el.label} />
                        )}
                    </datalist>}
            </div>
        }
    }

    return (
        <div className={"Input"
            + (type === "textarea" ? " textarea" : "")
            + (type === "select" ? " select" : "")
            + (type === "multiselect" ? " multiselect" : "")
            + (hidden ? " hidden" : "")
        }>
            {!compact && <label className="Input-label" htmlFor={label}>{label}</label>}
            {renderInput(type)}
        </div>
    )
}

export default Component;
