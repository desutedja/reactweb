import React, { } from 'react';
import { Field } from 'formik';
import { FiAlertCircle } from 'react-icons/fi';

function RadioInput({ onChange = () => { }, ...props }) {
    const {
        options = [], values, name, handleChange, errors, touched
    } = props;

    return (
        <div className="Radio row">
            {options.map(el => (
                <div className="col" key={el.value}>
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
            {errors[name] && touched[name] ? (
                <div className="Input-error">
                    <FiAlertCircle style={{
                        marginRight: 4
                    }} />
                    {errors ? errors[name] : ''}</div>
            ) : null}
        </div>
    )
}

export default RadioInput;
