import React, { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

function Component({ label, type = "text", rows = 1, options = [] }) {
    const [value, setValue] = useState(type === "button" ? label : "");

    return (
        <div className={"Input"
            + (type === "textarea" ? " textarea" : "")
            + (type === "select" ? " select" : "")
        }>
            <label className="Input-label" htmlFor={label}>{label}</label>
            {type === "textarea" ?
                <textarea
                    className="Input-input"
                    type={type}
                    id={label}
                    name={label}
                    required
                    placeholder={label}
                    maxLength="100"
                    rows={rows}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
                :
                type === "select" ?
                    <div className="Select">
                        <select
                            style={{
                                color: !value && 'grey'
                            }}
                            className="Input-input"
                            type={type}
                            id={label}
                            name={label}
                            required
                            placeholder={label}
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                        >
                            <option value="">{label}</option>
                            {options.map(el =>
                                <option key={el.value} value={el.value}>{el.label}</option>
                            )}
                        </select>
                        <FiChevronDown className="SelectArrow" />
                    </div>
                    :
                    <input
                        className="Input-input"
                        type={type}
                        id={label}
                        name={label}
                        required
                        placeholder={label}
                        maxLength="20"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    />}
        </div>
    )
}

export default Component;