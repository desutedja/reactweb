import React, { } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FiPlus } from 'react-icons/fi';
import { Badge } from 'reactstrap';

import Button from '../../components/Button';

import Resident from '../../components/cells/Resident';

import { getResident, setSelected, deleteResident } from '../slices/resident';
import { toSentenceCase } from '../../utils';

import Template from './components/Template';

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

    let dispatch = useDispatch();
    let history = useHistory();
    let { url } = useRouteMatch();

    return (
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
                />
            ]}
            deleteAction={deleteResident}
        />
    )
}

export default Component;
