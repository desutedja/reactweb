import React, { useState, useEffect, useRef } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import MoonLoader from "react-spinners/MoonLoader";

import { storageRef } from '../firebase';

function Component({
    label, compact, name, optional = true,
    type = "text", rows = 2, options = [],
    inputValue, setInputValue, icon, onClick,
    hidden, max, min
}) {
    const [value, setValue] = useState(type === "button" ? label : inputValue ? inputValue : "");
    const [uploading, setUploading] = useState(false);

    let uploader = useRef();

    useEffect(() => {
        inputValue && setValue(inputValue);
    }, [inputValue])

    return (
        <div className={"Input"
            + (type === "textarea" ? " textarea" : "")
            + (type === "select" ? " select" : "")
            + (hidden ? " hidden" : "")
        }>
            {!compact && <label className="Input-label" htmlFor={label}>{label}</label>}
            {type === "textarea" ?
                <textarea
                    className="Input-input"
                    type={type}
                    id={label}
                    name={name ? name : label.toLowerCase().replace(/ /g, '_')}
                    required={!optional}
                    placeholder={label}
                    maxLength="100"
                    rows={rows}
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value);
                        setInputValue && setInputValue(e.target.value);
                    }}
                />
                :
                type === "select" ?
                    <div className="Input-container">
                        <select
                            style={{
                                color: !value && 'grey'
                            }}
                            className="Input-input"
                            type={type}
                            id={label}
                            name={name ? name : label.toLowerCase().replace(/ /g, '_')}
                            required={!optional}
                            placeholder={label}
                            value={value}
                            onChange={(e) => {
                                setValue(e.target.value);
                                setInputValue && setInputValue(e.target.value);
                            }}
                            onClick={onClick}
                        >
                            <option value="">{label}</option>
                            {options.map(el =>
                                <option key={el.value} value={el.value}>{el.label}</option>
                            )}
                        </select>
                        <div className="InputIcon">
                            <FiChevronDown />
                        </div>
                    </div>
                    :
                    type === "file" ?
                        <div className="Input-container">
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
                        </div>
                        :
                        <div className="Input-container">
                            {icon && !value ? <div className="InputIcon">
                                {icon}
                            </div> : null}
                            <input
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
                                value={value}
                                onChange={(e) => {
                                    // console.log(e.target.value);
                                    if (type === 'url') {
                                        setValue('http://' + e.target.value.replace('http://', ''));
                                        setInputValue && setInputValue('http://' + e.target.value.replace('http://', ''));
                                    } else {
                                        setValue(e.target.value);
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
                        </div>}
        </div>
    )
}

export default Component;