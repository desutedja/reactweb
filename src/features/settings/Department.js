import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { post, patch, setInfo } from '../slice';

import { endpointManagement } from '../../settings';
import { toSentenceCase } from '../../utils';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import {FiChevronDown} from 'react-icons/fi'

export default function ({title, toggleRefresh, modal, toggleModal, data, picBmList}) {

    let dispatch = useDispatch();

    const [departmentName, setDepartmentName] = useState('');
    const [bmId, setBmId] = useState(null);

    useEffect(() => {
        setDepartmentName(data.department_name);
        setBmId(data.bm_id);
    }, [data, modal])

    const clearData = () => {
        setDepartmentName('');
        setBmId(null);
    }

    const submit = () => {
        const editSubmit = {
            id: data.id,
            department_name: departmentName,
            // bm_id: Number(bmId)
        }
        const addSubmit = {
            department_name: departmentName,
            bm_id: Number(bmId)
        }
        if (title === 'Add Department') {
            dispatch(post(endpointManagement + '/admin/department', addSubmit, res => {
                toggleRefresh();
                dispatch(setInfo({
                    message: 'Department has been created'
                }))
            }))
            toggleModal();
            clearData();
            return;
        }
        dispatch(patch(endpointManagement + '/admin/department', editSubmit, res => {
            toggleRefresh();
            dispatch(setInfo({
                color: 'success',
                message: 'Department has been edited.'
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
                clearData();
            }}
        >
            <Input label="Name" inputValue={departmentName} setInputValue={setDepartmentName}/>
            <Input disabled={title === 'Edit Department'} label="PIC BM" type="select" options={picBmList} inputValue={bmId} setInputValue={setBmId}/>
        </Modal>
    )
}