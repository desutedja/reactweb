import React, { useCallback, useState } from 'react';
import { useRouteMatch, Switch, Route, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiPlus } from 'react-icons/fi';

import Resident from '../../components/Resident';
import Table from '../../components/Table';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { Badge } from 'reactstrap';
import { getResident, getResidentDetails, deleteResident, setSelected } from './slice';
import Add from './Add';
import Edit from './Edit';
import AddSub from './AddSub';
import Details from '../details/resident';
import { toSentenceCase } from '../../utils';

const columns = [
    // { Header: "ID", accessor: "id" },
    {
        Header: "Resident",
        accessor: row => <Resident id={row.id} />,
    },
    { Header: "Email", accessor: "email" },
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
    const [confirm, setConfirm] = useState(false);
    const [selectedRow, setRow] = useState({});


    const { loading, items, total_pages, total_items, refreshToggle } = useSelector(state => state.resident);

    let dispatch = useDispatch();
    let history = useHistory();
    let { path, url } = useRouteMatch();

    return (
        <div>
            <Modal isOpen={confirm} toggle={() => setConfirm(false)}>
                Are you sure you want to delete this resident?
                <div style={{
                    display: 'flex',
                    marginTop: 16,
                }}>
                    <Button label="No" secondary
                        onClick={() => setConfirm(false)}
                    />
                    <Button label="Yes"
                        onClick={() => {
                            setConfirm(false);
                            dispatch(deleteResident(selectedRow,));
                        }}
                    />
                </div>
            </Modal>
            <Switch>
                <Route exact path={path}>
                    <Table totalItems={total_items}
                        columns={columns}
                        data={items}
                        loading={loading}
                        pageCount={total_pages}
                        fetchData={useCallback((pageIndex, pageSize, search) => {
                            dispatch(getResident(pageIndex, pageSize, search));
                            // eslint-disable-next-line react-hooks/exhaustive-deps
                        }, [dispatch, refreshToggle])}
                        filters={[]}
                        actions={[
                            <Button key="Add Resident" label="Add Resident" icon={<FiPlus />}
                                onClick={() => {
                                    dispatch(setSelected({}));
                                    history.push(url + "/add");
                                }}
                            />
                        ]}
                        onClickDelete={row => {
                            setRow(row);
                            setConfirm(true);
                        }}
                    />
                </Route>
                <Route path={`${path}/add`}>
                    <Add />
                </Route>
                <Route path={`${path}/edit`}>
                    <Edit />
                </Route>
                <Route path={`${path}/add-subaccount`}>
                    <AddSub />
                </Route>
                <Route path={`${path}/:id`}>
                    <Details />
                </Route>
            </Switch>
        </div>
    )
}

export default Component;
