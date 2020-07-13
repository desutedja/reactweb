import React, { } from 'react';
import { Field } from 'formik';

function RadioInput({ onChange = () => { }, ...props }) {
    const {
        options = [], values, name, handleChange,
    } = props;

    return (
        <div className="Radio row">
            {options.map(el => (
                <div className="col">
                    <div className="form-check">
                        <Field className="form-check-input" type="radio"
                            name={name}
                            id={el.label}
                            value={el.value}
                            checked={values[name] === el.value}
                            onChange={e => {
                                onChange(e.target.value);
                                handleChange(e);
                            }}
                        />
                        <label className="form-check-label m-0 ml-2" htmlFor={el.label}>
                            {el.label}
                        </label>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default RadioInput;
