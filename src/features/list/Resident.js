import React, { useState, useEffect, useRef } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiPlus } from 'react-icons/fi';

import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Pill from '../../components/Pill';
import Loading from '../../components/Loading';

import Resident from '../../components/cells/Resident';

import { getResident, setSelected, deleteResident } from '../slices/resident';
import { toSentenceCase } from '../../utils';

import Template from './components/Template';
import { post } from '../slice';
import { endpointResident } from '../../settings';

const columns = [
    {
        Header: "Resident",
        accessor: row => <Resident id={row.id} data={row} />,
        sorting: 'firstname',
    },
    {
        Header: "Onboarded",
        accessor: row => <Pill color={row.onboarding === "yes" ? "success" : "secondary"}>
            {toSentenceCase(row.onboarding)}</Pill>,
        sorting: 'onboarding',
    },
    {
        Header: "Email",
        accessor: row => <a target="_blank" rel="noopener noreferrer"
            href={'mailto:' + row.email}>{row.email}</a>,
        sorting: 'email',
    },
    { Header: "Phone", accessor: "phone", sorting: 'phone' },
    {
        Header: "KYC Status", accessor: row => row.status_kyc ?
            <Pill color="primary">{toSentenceCase(row.status_kyc)}</Pill>
            :
            <Pill color="secondary">None</Pill>,
        sorting: 'status_kyc',
    },
]

function Component() {
    const { role } = useSelector(state => state.auth);

    const [loading, setLoading] = useState(false);
    const [bulk, setBulk] = useState(false);
    const [file, setFile] = useState();
    const [data, setData] = useState();
    const [res, setRes] = useState();

    let fileInput = useRef();

    let dispatch = useDispatch();
    let history = useHistory();
    let { url } = useRouteMatch();

    useEffect(() => {
        // console.log(file);

        let form = new FormData();
        form.append('resident', file);

        setData(form);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [file]);

    useEffect(() => {
        // console.log(data);
    }, [data])

    return (
        <>
            <Modal
                isOpen={bulk}
                toggle={() => {
                    setBulk(false);
                    setRes();
                }}
                title="Upload Bulk File"
                okLabel={res ? "OK" : "Submit"}
                disablePrimary={loading}
                disableSecondary={loading}
                onClick={res ?
                    () => {
                        setBulk(false);
                        setRes();
                    }
                    :
                    () => {
                        setLoading(true);
                        dispatch(post(endpointResident + '/management/resident/register/bulk',
                            data,
                            res => {
                                setLoading(false);

                                setRes(res.data.data);
                            },
                            err => {
                                setLoading(false);
                            }
                        ));
                    }}
            >
                {res ?
                    <div>
                        <p style={{
                            color: 'seagreen'
                        }}>{res.data ? res.data.length : 0} rows added succesfully.</p>
                        <p style={{
                            color: 'crimson',
                            marginBottom: 16,
                        }}>{res.error ? res.error.length : 0} rows failed to add.</p>
                        {res.error.map(el => <p style={{
                            color: 'crimson',
                            marginBottom: 4,
                        }}>{el}</p>)}
                    </div>
                    :
                    <Loading loading={loading}>
                        <input
                            ref={fileInput}
                            type="file"
                            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                            onChange={e => {
                                setFile(fileInput.current.files[0]);
                            }}
                        />
                    </Loading>
                }
            </Modal>
            <Template
                columns={columns}
                slice={'resident'}
                getAction={getResident}
                actions={[
                    <Button key="Add Resident" label="Add Resident" icon={<FiPlus />}
                        onClick={() => {
                            dispatch(setSelected({}));
                            history.push(url + "/add");
                        }}
                    />,
                    <Button key="Add Resident Bulk" label="Add Resident Bulk" icon={<FiPlus />}
                        onClick={() => {
                            setBulk(true);
                        }}
                    />,
                ]}
                deleteAction={role === 'sa' && deleteResident}
            />
        </>
    )
}

export default Component;
