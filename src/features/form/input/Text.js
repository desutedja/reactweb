import React, { useState, useEffect } from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import { Field } from 'formik';

function TextInput({
    as, label, name, prefix, suffix, options, externalValue,
    onChange = () => { }, ...rest
}) {
    const [isFocused, setFocus] = useState(false);
    const [value, setValue] = useState('');

    const { handleChange, setFieldValue, ...restInput } = rest;
    const { errors, touched, values } = restInput;
    const fixedName = name + (options ? '_label' : '');

    useEffect(() => {
        externalValue && setFieldValue(fixedName, externalValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [externalValue])

    //this repopulate the label field when editing, provided BE doesnt send them
    useEffect(() => {
        options && options.length === 0 && setFieldValue(fixedName, 'Loading...')
        options && values[fixedName] === 'Loading...' && setFieldValue(fixedName, '');

        options && !values[fixedName] && values[name] &&
            setFieldValue(fixedName,
                // eslint-disable-next-line eqeqeq
                options.find(el => el.value == values[name])?.label);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [options])

    return (
        <>
            <div className="Input-container">
                {prefix && <div className="Input-prefix">
                    {prefix}
                </div>}
                <Field
                    as={as}
                    rows="4"
                    // onClick={() => setFocus(!isFocused)}
                    onFocus={() => setFocus(!isFocused)}
                    onBlur={() => setTimeout(() => setFocus(!isFocused), 500)}
                    name={fixedName}
                    className={errors[name] && touched[name] && "error"}
                    style={{
                        borderTopLeftRadius: prefix && 0,
                        borderBottomLeftRadius: prefix && 0,
                        borderTopRightRadius: suffix && 0,
                        borderBottomRightRadius: suffix && 0,
                    }}
                    placeholder={label}
                    autoComplete={options ? "off" : ""}
                    onChange={e => {
                        !options && onChange(e.target.value);

                        setValue(e.target.value);
                        handleChange(e);
                    }}
                    {...restInput}
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
                {options
                    .filter(el => el.label.toLowerCase().includes(value.toLowerCase()))
                    .map(el =>
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
                            style={{
                                padding: 8,
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
