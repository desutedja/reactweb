import React, {  } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getManagement, deleteManagement, setSelected } from '../slices/management';
import { FiPlus } from 'react-icons/fi';

import Button from '../../components/Button';
import Link from '../../components/Link';
import Management from '../../components/cells/Management';

import Template from './components/Template';

const columns = [
    // { Header: "ID", accessor: "id" },
    { Header: "Name", accessor: row => <Management id={row.id} data={row} /> },
    { Header: "Legal Name", accessor: "name_legal" },
    { Header: "Phone", accessor: "phone" },
    // { Header: "Email", accessor: "email" },
    { Header: "Website", accessor: row => <Link>{row.website}</Link> },
]

function Component({ view }) {
    let dispatch = useDispatch();
    let history = useHistory();
    let { url } = useRouteMatch();

    return (
        <Template
            view={view}
            columns={columns}
            slice="management"
            getAction={getManagement}
            deleteAction={deleteManagement}
            actions={[
                <Button key="Add" label="Add" icon={<FiPlus />}
                    onClick={() => {
                        dispatch(setSelected({}));
                        history.push(url + "/add")
                    }}
                />
            ]}
        />
    )
}

export default Component;
