import React, { useCallback, useState } from 'react';
import { useRouteMatch, Switch, Route, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getManagement, deleteManagement, getManagementDetails, setAlert } from './slice';
import { FiPlus, FiX } from 'react-icons/fi';

import Table from '../../components/Table';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import IconButton from '../../components/IconButton';
import Add from './Add';
import Details from './Details';

const columns = [
    { Header: "Name", accessor: "name" },
    { Header: "Legal Name", accessor: "name_legal" },
    { Header: "Phone", accessor: "phone" },
    { Header: "Email", accessor: "email" },
    { Header: "Website", accessor: "website" },
    { Header: "PIC Name", accessor: "pic_name" },
    { Header: "PIC Phone", accessor: "pic_phone" },
    { Header: "PIC Email", accessor: "pic_email" },
    { Header: "Logo", accessor: "logo" },
]

function Component() {
    const [confirm, setConfirm] = useState(false);
    const [selectedRow, setRow] = useState({});

    const headers = useSelector(state => state.auth.headers);
    const { loading, items, total_pages, refreshToggle, alert } = useSelector(state => state.management);

    let dispatch = useDispatch();
    let history = useHistory();
    let { path, url } = useRouteMatch();

    return (
        <div>
            <Modal isOpen={confirm} onRequestClose={() => setConfirm(false)}>
                Are you sure you want to delete?
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
                            dispatch(deleteManagement(selectedRow, headers));
                        }}
                    />
                </div>
            </Modal>
            <Switch>
                <Route exact path={path}>
                    {alert.message && <div className={"Alert " + alert.type}>
                        <p>{alert.message}</p>
                        <IconButton onClick={() => dispatch(setAlert({}))}>
                            <FiX />
                        </IconButton>
                    </div>}
                    <Table
                        columns={columns}
                        data={items}
                        loading={loading}
                        pageCount={total_pages}
                        fetchData={useCallback((pageIndex, pageSize, search) => {
                            dispatch(getManagement(headers, pageIndex, pageSize, search));
                            // eslint-disable-next-line react-hooks/exhaustive-deps
                        }, [dispatch, headers, refreshToggle])}
                        filters={[]}
                        actions={[
                            <Button key="Add" label="Add" icon={<FiPlus />}
                                onClick={() => history.push(url + "/add")}
                            />
                        ]}
                        onClickDelete={row => {
                            setRow(row);
                            setConfirm(true);
                        }}
                        onClickDetails={row => dispatch(getManagementDetails(row, headers, history, url))}
                    />
                </Route>
                <Route path={`${path}/add`}>
                    <Add />
                </Route>
                <Route path={`${path}/details`}>
                    <Details />
                </Route>
            </Switch>
        </div>
    )
}

export default Component;