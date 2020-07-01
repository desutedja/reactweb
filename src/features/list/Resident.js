import React, { useState, useEffect, useRef } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FiPlus } from 'react-icons/fi';
import { Badge } from 'reactstrap';
import MoonLoader from "react-spinners/MoonLoader";

import Button from '../../components/Button';
import Modal from '../../components/Modal';

import Resident from '../../components/cells/Resident';

import { getResident, setSelected, deleteResident } from '../slices/resident';
import { toSentenceCase } from '../../utils';

import Template from './components/Template';
import { post } from '../slice';
import { endpointResident } from '../../settings';

const columns = [
    {
        Header: "Resident",
        accessor: row => <Resident id={row.id} />,
    },
    {
        Header: "Email", accessor: row => <a target="_blank" rel="noopener noreferrer"
            href={'mailto:' + row.email}>{row.email}</a>
    },
    { Header: "Phone", accessor: "phone" },
    {
        Header: "Status", accessor: row => row.status ?
            <h5><Badge pill color="success">{toSentenceCase(row.status)}</Badge></h5>
            :
            <h5><Badge pill color="secondary">Inactive</Badge></h5>
    },
    {
        Header: "KYC Status", accessor: row => row.status_kyc ?
            <h5><Badge pill color="primary">{toSentenceCase(row.status_kyc)}</Badge></h5>
            :
            <h5><Badge pill color="secondary">None</Badge></h5>
    },
]

function Component() {
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
                            color: 'crimson'
                        }}>{res.error ? res.error.length : 0} rows failed to add.</p>
                    </div>
                    :
                    <input
                        ref={fileInput}
                        type="file"
                        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        onChange={e => {
                            setFile(fileInput.current.files[0]);
                        }}
                    />
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
                deleteAction={deleteResident}
            />
        </>
    )
}

export default Component;