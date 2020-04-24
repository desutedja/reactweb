import React, { useState, useEffect } from 'react';
import { FiChevronDown, FiCheck } from 'react-icons/fi';
import MoonLoader from "react-spinners/MoonLoader";

function Component({
    label, compact, name, optional = false,
    type = "text", rows = 2, options = [],
    inputValue, setInputValue, icon, onClick
}) {
    const [value, setValue] = useState(type === "button" ? label : inputValue ? inputValue : "");

    useEffect(() => {
        inputValue && setValue(inputValue);
    }, [inputValue])

    return (
        <div className={"Input"
            + (type === "textarea" ? " textarea" : "")
            + (type === "select" ? " select" : "")
        }>
            {!compact && <label className="Input-label" htmlFor={label}>{label}</label>}
            {type === "textarea" ?
                <textarea
                    className="Input-input"
                    type={type}
                    id={label}
                    name={name ? name : label.toLowerCase().replace(' ', '_')}
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
                            name={name ? name : label.toLowerCase().replace(' ', '_')}
                            required={!optional}
                            placeholder={label}
                            value={value}
                            onChange={(e) => {
                                setValue(e.target.value);
                                setInputValue && setInputValue(e.target.value);
                            }}
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
                    <div className="Input-container">
                        {icon && !value ? <div className="InputIcon">
                            {icon}
                        </div> : null}
                        <input
                            className="Input-input"
                            accept="image/*"
                            type={type}
                            id={label}
                            name={name ? name : label.toLowerCase().replace(' ', '_')}
                            required={!optional}
                            placeholder={label}
                            maxLength="20"
                            size="30"
                            value={value}
                            onChange={(e) => {
                                if (type === 'url') {
                                    setValue('http://' + e.target.value.replace('http://', ''));
                                    setInputValue && setInputValue('http://' + e.target.value.replace('http://', ''));
                                } else {
                                    setValue(e.target.value);
                                    setInputValue && setInputValue(e.target.value);
                                }
                            }}
                            onClick={onClick}
                        />
                    </div>}
        </div>
    )
}

export default Component;