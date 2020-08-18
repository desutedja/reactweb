import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { post, patch, setInfo } from '../slice';

import { endpointMerchant, merchant_types } from '../../settings';
import { toSentenceCase } from '../../utils';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import {FiChevronDown} from 'react-icons/fi'

export default function ({title, toggleRefresh, modal, toggleModal, data}) {

    let dispatch = useDispatch();

    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [icon, setIcon] = useState('');

    useEffect(() => {
        setName(data.name);
        setType(toSentenceCase(data.type).replace(' ', ''));
        setIcon(data.icon);
    }, [data])

    const clearData = () => {
        setName('');
        setType(toSentenceCase(''));
        setIcon('');
    }

    const submit = () => {
        const editSubmit = {
            "id": data.id,
            name, type: type.toLowerCase(), icon
        }
        const addSubmit = {
            name, type: type.toLowerCase(), icon
        }
        if (title === 'Add Category') {
            console.log(addSubmit)
            dispatch(post(endpointMerchant + '/admin/categories', addSubmit, res => {
                toggleRefresh();
                dispatch(setInfo({
                    message: 'Category has been created'
                }))
            }))
            toggleModal();
            clearData();
            return;
        }
        console.log(addSubmit)
        dispatch(patch(endpointMerchant + '/admin/categories', editSubmit, res => {
            toggleRefresh();
            dispatch(setInfo({
                color: 'success',
                message: 'Category has been edited.'
            }))
        }))
        toggleModal();
        clearData();
    }

    return (
        <Modal
            title={title}
            isOpen={modal}
            toggle={() => {
                toggleModal();
                clearData();
            }}
            okLabel="Confirm"
            onClick={() => {
                submit();
            }}
            onClickSecondary={() => {
                toggleModal();
                clearData()
            }}
        >
            <Input label="Icon" type="file" inputValue={icon} setInputValue={setIcon}/>
            <Input label="Name" inputValue={name} setInputValue={setName}/>
            {/* <Input label="Type" type="select" options={merchant_types} inputValue={type} setInputValue={setType}/> */}
            <div className="mt-3">  
                <label htmlFor="type"><strong>Type</strong></label>
                <div className="Input-container w-100">
                    <select
                        id="type"
                        onChange={(e) => {
                            setType(e.target.value);
                        }}
                    >
                        {type && <option>Type</option>}
                        {merchant_types.map((el, i) => {
                            return <option key={i} value={el.value} selected={type === el.label}>{el.label}</option>
                        })}
                    </select>
                    <div className="InputIcon">
                        <FiChevronDown />
                    </div>
                </div>
            </div>
        </Modal>
    )
}