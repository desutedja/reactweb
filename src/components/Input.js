import React, { useState, useEffect, useRef } from 'react';
import { FiChevronDown, FiX } from 'react-icons/fi';
import MoonLoader from "react-spinners/MoonLoader";
// import ComboBox from './ComboBox';
import { rangeNumber } from '../utils'

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
    label = "", actionlabels = {}, placeholder = null, compact, name, optional = true,
    type = "text", rows = 2, options = [], fullwidth = false, inputClassName='',
    inputValue, setInputValue, icon, onClick, onFocus, onBlur, cancelValue,
    hidden, max, min, disabled=false, isValidate = false, validationMsg, accept = "image/*",
    addons,
}) {
    const ch = new Date().getHours().toString().length < 2 ?
    '0' + new Date().getHours() : new Date().getHours().toString()
    const cm = new Date().getMinutes().toString().length < 2 ?
    '0' + new Date().getMinutes() : new Date().getMinutes().toString()

    const [value, setValue] = useState(inputValue ? inputValue : "");
    const [uploading, setUploading] = useState(false);
    const [hours, setHours] = useState(ch);
    const [minutes, setMinutes] = useState(cm);
    const [timePick, setTimePick] = useState(inputValue ? inputValue : (hours + ':' + minutes));
    const [modalTime, setModalTime] = useState(false);

    let uploader = useRef();
    
    useEffect(() => {
        setTimePick(hours + ':' + minutes)
    }, [hours, minutes])

    useEffect(() => {
        setValue(inputValue);
        inputValue && setTimePick(inputValue)
    }, [inputValue])

    const renderInput = type => {
        switch (type) {
            case 'multiselect':
                return <div className="MultiSelect" onClick={inputValue.length === 0 ? onClick : undefined}>
                    {inputValue.length > 0 ? inputValue.map((el, index) =>
                        <MultiSelectItem
                            key={index}
                            value={el.value}
                            onClickDelete={el.onClickDelete} />) :
                        <p style={{ color: 'grey' }}>
                            {label}
                        </p>
                    }
                </div>;

            case 'textarea': return <textarea
                type={type}
                id={label}
                name={name ? name : label.toLowerCase().replace(/ /g, '_')}
                required={!optional}
                placeholder={label}
                rows={rows}
                value={inputValue === '' ? '' : value}
                onChange={(e) => {
                    setValue(e.target.value);
                    setInputValue && setInputValue(e.target.value);
                }}
            />;

            case 'select':
                // if (options.length > 10) {
                //     return (
                //         <>
                //             <ComboBox
                //                 options={options}
                //                 label={label}
                //                 // comboName={}
                //                 comboValue={value}
                //                 setComboValue={e => {
                //                     setValue(e.target.value);
                //                     setInputValue && setInputValue(e.target.value);
                //                 }}
                //             />
                //             <input name={name ? name : label.toLowerCase().replace(/ /g, '_')}
                //                 className="hidden"
                //                 value={value}
                //             />
                //         </>
                //     )
                // }
                return (
                    <div className="Input-container w-100">
                        <select
                            disabled={disabled}
                            style={{
                                color: !value && 'grey'
                            }}
                            type={type}
                            id={label}
                            name={name ? name : label.toLowerCase().replace(/ /g, '_')}
                            required={!optional}
                            placeholder={placeholder == null ? label : placeholder}
                            rows={rows}
                            value={value}
                            onChange={(e) => {
                                // console.log(e.target.value)
                                setValue(e.target.value);
                                setInputValue && setInputValue(e.target.value);
                            }}
                            onClick={onClick}
                        >
                            {(!inputValue || placeholder) && <option value="">{placeholder == null ? label : placeholder}</option>}
                            {options.map(el =>
                                <option key={el.value} value={el.value}>{el.label}</option>
                            )}
                        </select>
                        <div className="InputIcon">
                            <FiChevronDown />
                        </div>
                    </div>
                );

            case 'radio': return (
                <div className="row">
                    {options.map(el => {
                        return (
                            <div className="col-6">
                                <div className="form-check">
                                    {inputValue === el.value ?
                                        <input className="form-check-input" type="radio"
                                            name={name ? name : label.toLowerCase().replace(/ /g, '_')}
                                            id={el.label}
                                            value={el.value}
                                            checked /> :
                                        <input className="form-check-input" type="radio"
                                            name={name ? name : label.toLowerCase().replace(/ /g, '_')}
                                            id={el.label}
                                            value={el.value} />
                                    }
    
                                    <label className="form-check-label m-0 ml-2" for={el.label}>
                                        {el.label}
                                    </label>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )
            case 'file': return <div className="Input-container">
                {uploading && <div className="InputIcon">
                    <MoonLoader
                        size={14}
                        color={"grey"}
                        loading={uploading}
                    />
                </div>}
                <input
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
            case 'time':
                return (
                    <div className="Input-container">
                        <input
                            type="text"
                            id={label}
                            value={timePick}
                            disabled={disabled}
                            name={name ? name : label.toLowerCase().replace(/ /g, '_')}
                            onChange={e => {
                                setTimePick(e.target.value);
                                setInputValue && setInputValue(e.target.value);
                            }}
                            onFocus={e => {
                                setModalTime(!modalTime)
                            }}
                            onBlur={e => {
                                !e.target.value || !e.target.value.match(/:/g) ? setTimePick('00:00') : setTimePick(e.target.value)
                                setTimeout(() => {
                                    setModalTime(false)
                                }, 100)
                            }}
                        />
                        <div className={'time-pick' + (modalTime ? ' time-show' : '')}>
                            <div className="time-wrap w-50 text-center">
                                {rangeNumber(0, 23).map(n => (
                                        <p className={(n === hours ? 'active' : '') + ' text-center py-2'}
                                            onClick={e => {
                                                setHours(e.target.innerHTML)
                                            }}
                                        >{n}</p>
                                    ))
                                }
                            </div>
                            <div className="time-wrap w-50">
                                {rangeNumber(0, 59).map(n => (
                                        <p className={(n === minutes ? 'active' : '') + ' text-center py-2'}
                                            onClick={e => {
                                                setMinutes(e.target.innerHTML)
                                                // setModalTime(false)
                                            }}
                                        >{n}</p>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                )
            default:
                // console.log(inputValue)
                return (
                    <div className="Input-container w-100">
                        {icon && <div className="InputIcon">
                            {icon}
                        </div>}
                        <input
                            disabled={disabled}
                            type={type}
                            id={label}
                            name={name ? name : label.toLowerCase().replace(/ /g, '_')}
                            className={addons ? "withaddons" : ""}
                            required={!optional}
                            placeholder={placeholder === null ? label : placeholder}
                            min={min}
                            max={max}
                            value={value ? value : type === "button" ? label : ""}
                            onBlur={onBlur}
                            onChange={(e) => {
                                // console.log(e.target.value);
                                if (type === 'url') {
                                    setValue('http://' + e.target.value.replace('http://', ''));
                                    setInputValue && setInputValue('http://' + e.target.value.replace('http://', ''));
                                } if (type === 'tel') {
                                    const { value } = e.target;
                                    const regex = /^[0-9]*$/;
                                    if (regex.test(value.toString())) {
                                        !onClick && setValue(e.target.value);
                                        setInputValue && setInputValue(e.target.value);
                                    }
                                } else {
                                    !onClick && setValue(e.target.value);
                                    setInputValue && setInputValue(e.target.value);
                                }
                            }}
                            onClick={onClick}
                            onFocus={onFocus}
                            list={type === 'searchable' ? ('options-' + label) : null}
                        />
                        {cancelValue && value && <div
                            onClick={() => {
                                setValue('')
                            }}
                            style={{
                                position: 'absolute',
                                right: '40px',
                                height: '24px',
                                width: '24px',
                                textAlign: 'center',
                                borderRadius: '50px',
                                cursor: 'pointer',
                                backgroundColor: 'rgba(0, 0, 0, .05)'
                            }}><FiX /></div>}
                        {type === 'searchable' &&
                            <datalist id={"options-" + label}>
                                {options.map(el =>
                                    <option key={el.value} value={el.label} />
                                )}
                            </datalist>}
                    </div>
                )
        }
    }

    return (
        <div className={"row w-100 m-0 " + (hidden ? " hidden " : "") + (inputClassName ? " "+inputClassName+" " : "")}>
            <div className="col px-0">
                <div className="row">
                    <div className={(fullwidth ? "FullInput" : "Input")
                        + (type === "textarea" ? " textarea" : "")
                        + (type === "select" ? " select" : "")
                        + (type === "multiselect" ? " multiselect" : "")
                        + ' col m-0'
                    }>
                        {!compact && <>
                            <div style={{ display: 'flex' }}>
                                <label className="Input-label mt-4" htmlFor={label}>
                                    {label}
                                </label>
                                {Object.keys(actionlabels).map(action =>
                                    // eslint-disable-next-line jsx-a11y/anchor-is-valid
                                    <a key={action} style={{ margin: '4px' }}
                                        href="#" onClick={actionlabels[action]} >{action}</a>
                                )}
                            </div>
                        </>}
                    </div>
                </div>
                <div className="row">
                    <div className={"d-flex col-12" + (isValidate ? " col-md-6" : "")} >
                        {renderInput(type)}
                        {addons && <div className="addons">{addons}</div>}
                    </div>
                    {isValidate && <div className="col-12 col-md-6 d-flex align-items-center">
                        <span className="validation-error">{validationMsg}</span>
                    </div>}
                </div>

            </div>
        </div>
    )
}

export default Component;
