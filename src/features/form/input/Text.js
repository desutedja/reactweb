import React, { useState, useEffect } from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import { Field } from 'formik';

function TextInput({
    as, label, name, prefix, suffix, options,
    onChange = () => { }, ...rest
}) {
    const [isFocused, setFocus] = useState(false);

    const { errors, touched, setFieldValue, handleChange, values } = rest;
    const fixedName = name + (options ? '_label' : '');

    //this repopulate the label field when editing, provided BE doesnt send them
    useEffect(() => {
        options && !values[fixedName] && 
        // console.log(fixedName, values[name], options.find(el => el.value == values[name])?.label)
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
                    autoComplete={options ? "off" : ""}
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
