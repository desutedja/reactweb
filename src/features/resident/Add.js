import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Input from '../../components/Input';
import Form from '../../components/Form';
import Modal from '../../components/Modal';
import SectionSeparator from '../../components/SectionSeparator';
import { createResident } from './slice';
import { post, get } from '../../utils';
import { endpointResident } from '../../settings';
import { FiSearch } from 'react-icons/fi';

function Component() {
    const [modal, setModal] = useState(false);
    const [exist, setExist] = useState(true);
    const [search, setSearch] = useState(true);

    const [email, setEmail] = useState('');

    const [unitID, setUnitID] = useState('');
    const [unitName, setUnitName] = useState('');
    const [units, setUnits] = useState([]);

    const headers = useSelector(state => state.auth.headers);
    const { loading, selected } = useSelector(state => state.resident);

    let dispatch = useDispatch();
    let history = useHistory();

    // useEffect(() => {
    //     get(endpointResident + '/management/resident/unit?id=' + selected.id +
    //         '&limit=10&page=1' +
    //         '&search=' + search, headers, res => {
    //             let data = res.data.data.items;

    //             let formatted = data.map(el => ({
    //                 label: el.building_name + ' by ' + el.management_name,
    //                 value: el.id
    //             }));

    //             setUnits(formatted);
    //         })
    // }, [headers, search, selected.id]);

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
                    {/* "birthplace": "cirebon",
                    "birthdate": "12-03-1997",
                    "gender": "L",
                    "address": "jalan kanggraksan utara rt 06 rw 01",
                    "district": 1,
                    "city": 1,
                    "province": 1,
                    "nationality": "indonesia",
                    "marital_status": "single",
                    "onboarding": "no",
                    "account_bank": null,
                    "account_no": null,
                    "account_name": null */}
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