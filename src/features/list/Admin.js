import React, {  } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FiPlus } from 'react-icons/fi';

import Button from '../../components/Button';
import Template from './components/Template';
import { getAdmin, setSelected, deleteAdmin } from '../slices/admin';
import Admin from '../../components/cells/Admin';
import { toSentenceCase } from '../../utils';

const columns = [
    { Header: "Name", accessor: row => <Admin id={row.id} data={row} /> },
    { Header: "Phone", accessor: "phone" },
    { Header: "Group", accessor: row => toSentenceCase(row.group) },
    { Header: "Status", accessor: row => toSentenceCase(row.status) },
]

function Component() {
    let dispatch = useDispatch();
    let history = useHistory();
    let { url } = useRouteMatch();

    return (
        <Template
            columns={columns}
            slice="admin"
            getAction={getAdmin}
            // deleteAction={deleteAdmin}
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
