import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Input from '../../components/Input';
import Form from '../../components/Form';
import Modal from '../../components/Modal';
import SectionSeparator from '../../components/SectionSeparator';
import { createResident } from './slice';
import { post } from '../../utils';
import { endpointResident } from '../../settings';
import { FiSearch } from 'react-icons/fi';

function Component() {
    const [modal, setModal] = useState(false);
    const [exist, setExist] = useState(true);

    const [email, setEmail] = useState('');

    const headers = useSelector(state => state.auth.headers);
    const loading = useSelector(state => state.resident.loading);

    let dispatch = useDispatch();
    let history = useHistory();

    return (
        <div>
            <Modal isOpen={modal} onRequestClose={() => setModal(false)}>
                <p>Resident with the provided email already exist.</p>
                <p style={{ marginBottom: 16 }}>Add as sub account to another resident?</p>
                <Input label="Select Resident" icon={<FiSearch />} compact />
            </Modal>
            <Form
                onSubmit={data => dispatch(createResident(headers, data, history))}
                loading={loading}
            >
                <div>
                    <Input label="Email" type="email" inputValue={email} setInputValue={setEmail} />
                    <Input label="Check" type="button" compact
                        onClick={() => {
                            post(endpointResident + '/management/resident/check', {
                                email: email
                            }, headers,
                                res => {
                                    res.data.data.id ?
                                        setModal(true)
                                        :
                                        setExist(false);
                                },
                            )
                        }}
                    />
                </div>
                {!exist && <>
                    <SectionSeparator />
                    <Input label="First Name" name="firstname" />
                    <Input label="Last Name" name="lastname" />
                    <Input label="Phone" type="tel" />
                </>}
            </Form>
        </div>
    )
}

export default Component;