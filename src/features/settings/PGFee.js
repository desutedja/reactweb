import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { post } from '../slice';

import { endpointAdmin } from '../../settings';
import Modal from '../../components/Modal';
import Input from '../../components/Input';

function PGFee({id, toggleRefresh, modal, toggleModal}) {
    const [fee, setFee] = useState('0');
    const [percentage, setPercentage] = useState('0');
    const [markup, setMarkup] = useState('0');

    let dispatch = useDispatch();

    const submit = () => {
        dispatch(post(endpointAdmin + '/centratama/config/pg_fee', {
            "id": id,
            "pg_fee": parseFloat(fee),
            "pg_percentage": parseFloat(percentage),
            "markup_percentage": parseFloat(markup),
            "pg_fee_type": "combination",
        }, res => toggleRefresh()))
        toggleModal();
    }

    return (
            <Modal
                isOpen={modal}
                toggle={() => toggleModal()}
                disableHeader
                okLabel="Confirm"
                onClick={() => {
                    submit();
                }}
                onClickSecondary={() => toggleModal()}
            >
                <Input label="Fee" inputValue={fee} setInputValue={setFee} addons="%" />
                <Input label="Percentage" inputValue={percentage} setInputValue={setPercentage} addons="%" />
                <Input label="Markup" inputValue={markup} setInputValue={setMarkup} addons="%" />
            </Modal>
    )
}

export default PGFee;