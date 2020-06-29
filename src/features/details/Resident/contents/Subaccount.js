import React, { useCallback } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import UserAvatar from '../../../../components/UserAvatar';
import Button from '../../../../components/Button';
import Table from '../../../../components/Table';
import { getSubaccount } from '../../../slices/resident';

const columnsSubaccount = [
    //{ Header: "ID", accessor: "id" },
    { Header: "Unit Number", accessor: "unit_number" },
    { Header: "Building", accessor: "building_name" },
    {
        Header: "Resident", accessor: row =>
            <UserAvatar fullname={row.firstname + " " + row.lastname} email={row.email} />
    },
]

function Component({ id }) {
    const { subaccount, loading, refreshToggle } = useSelector(state => state.resident);

    let dispatch = useDispatch();
    let history = useHistory();

    
    const fetchData = useCallback((pageIndex, pageSize, search) => {
        dispatch(getSubaccount( pageIndex, pageSize, search, id));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, refreshToggle, id])

    return (
        <Table
            columns={columnsSubaccount}
            data={subaccount.items}
            loading={loading}
            pageCount={subaccount.total_pages}
            fetchData={fetchData}
            filters={[]}
            actions={[
                <Button key="Add Sub Account" label="Add Sub Account" icon={<FiPlus />}
                    onClick={() => {
                        history.push("/resident/add-subaccount");
                    }}
                />
            ]}
        />
    )
}

export default Component;
