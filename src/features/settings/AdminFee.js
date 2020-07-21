import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { post } from '../slice';

import { endpointAdmin } from '../../settings';
import Modal from '../../components/Modal';
import Input from '../../components/Input';

function AdminFee({toggleRefresh, modal, toggleModal, title}) {
    const [fee, setFee] = useState('0');

    let dispatch = useDispatch();

    const submit = () => {
        dispatch(post(endpointAdmin + '/centratama/config/admin_fee', {
            "admin_fee": parseFloat(fee),
        }, res => toggleRefresh()))
        toggleModal();
    }

    return (
            <Modal
                title={title}
                isOpen={modal}
                toggle={() => toggleModal()}
                okLabel="Confirm"
                onClick={() => {
                    submit();
                }}
                onClickSecondary={() => toggleModal()}
            >
                <Input label="Fee" inputValue={fee} setInputValue={setFee} addons="%" />
            </Modal>
    )
}

export default AdminFee;