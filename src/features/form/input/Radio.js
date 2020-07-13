import React, { } from 'react';
import { Field } from 'formik';

function RadioInput(props) {
    const {
        options = [], values, name
    } = props;

    return (
        <div className="Radio row">
            {options.map(el => (
                <div className="col-6">
                    <div className="form-check">
                        <Field className="form-check-input" type="radio"
                            name={name}
                            id={el.label}
                            value={el.value}
                            checked={values[name] === el.value}
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
