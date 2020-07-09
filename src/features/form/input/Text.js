import React, { useState } from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import { Field } from 'formik';

function TextInput({
    as, label, name, prefix, suffix, options,
    onChange = () => { }, ...rest
}) {
    const [isFocused, setFocus] = useState(false);
    // const [value, setValue] = useState('');

    const { errors, touched, setFieldValue, handleChange } = rest;
    const fixedName = name + (options ? '_label' : '');

    return (
        <>
            <div className="Input-container">
                {prefix && <div className="Input-prefix">
                    {prefix}
                </div>}
                <Field
                    as={as}
                    rows="4"
                    onClick={() => setFocus(!isFocused)}
                    name={fixedName}
                    className={errors[name] && touched[name] && "error"}
                    style={{
                        borderTopLeftRadius: prefix && 0,
                        borderBottomLeftRadius: prefix && 0,
                        borderTopRightRadius: suffix && 0,
                        borderBottomRightRadius: suffix && 0,
                    }}
                    placeholder={label}
                    onChange={e => {
                        handleChange(e);
                        // onChange();
                    }}
                    {...rest}
                />
                {suffix && <div className="Input-suffix">
                    {suffix}
                </div>}
            </div>
            {errors[name] && touched[name] ? (
                <div className="Input-error">
                    <FiAlertCircle style={{
                        marginRight: 4
                    }} />
                    {errors ? errors[name] : ''}</div>
            ) : null}
            {isFocused && options && <div
                className="Input-options"
            >
                {options.map(el =>
                    <p
                        key={el.value}
                        className="Input-optionItem"
                        onClick={() => {
                            console.log('clicked');
                            // setValue(el.value);
                            setFieldValue(fixedName, el.label);
                            setFieldValue(name, el.value);
                            onChange(el);
                            setFocus(false);
                        }}
                    >
                        {el.label}
                    </p>
                )}
            </div>}
        </>
    )
}

export default TextInput;
