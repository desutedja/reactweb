import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { post, patch, setInfo } from '../slice';

import { endpointMerchant, merchant_types } from '../../settings';
import { toSentenceCase } from '../../utils';
import Modal from '../../components/Modal';
import Input from '../../components/Input';

export default function ({
    title, toggleRefresh, modal,
    toggleModal, data, toggleLoading
}) {

    let dispatch = useDispatch();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        setName(data.name);
        setDescription(data.description);
    }, [data, modal])

    const clearData = () => {
        setName('');
        setDescription('');
    }

    const submit = () => {
        const editSubmit = {
            "id": data.id,
            name, description
        }
        const addSubmit = {
            name, description
        }
        if (title === 'Add Category') {
            toggleLoading(true);
            dispatch(post("http://86.38.203.90:1111/category", addSubmit, res => {
                toggleRefresh();
                dispatch(setInfo({
                    message: 'Category has been created'
                }))
                toggleLoading(false);
            }))
            toggleModal();
            clearData();
            return;
        }
        console.log(addSubmit)
        dispatch(patch("http://86.38.203.90:1111/category", editSubmit, res => {
            toggleLoading(true);
            toggleRefresh();
            dispatch(setInfo({
                color: 'success',
                message: 'Category has been edited.'
            }))
            toggleLoading(false);
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
                clearData();
            }}
        >
            <Input label="Name" inputValue={name} setInputValue={setName}/>
            <Input label="Description" inputValue={description} setInputValue={setDescription}/>
           
        </Modal>
    )
}