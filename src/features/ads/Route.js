import React, { useCallback, useState } from 'react';
import { useRouteMatch, Switch, Route, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiPlus } from 'react-icons/fi';

import Table from '../../components/Table';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import { getAds, getAdsDetails, setSelected, deleteAds } from './slice';
import Details from './Details';
import Add from './Add';

const columns = [
    { Header: "ID", accessor: "id" },
    { Header: "Title", accessor: "content_name" },
    {
        Header: "Target", accessor: row =>
            row.gender + ", " + row.age_from + "-" + row.age_to + ", " + row.os
    },
    { Header: "Priority", accessor: "total_priority_score" },
    { Header: "Appear As", accessor: "appear_as" },
    { Header: "Image", accessor: "" },
    { Header: "Media Type", accessor: "media" },
    { Header: "Media URL", accessor: "media_url" },
    { Header: "Start Date", accessor: row => row.start_date?.split("T")[0] },
    { Header: "End Date", accessor: row => row.end_date?.split("T")[0] },
    { Header: "Status", accessor: "published" },
]

function Component() {
    const [confirm, setConfirm] = useState(false);
    const [selectedRow, setRow] = useState({});

    const [agef, setAgef] = useState("");
    const [aget, setAget] = useState("");
    const [agefSet, setAgefSet] = useState("");
    const [agetSet, setAgetSet] = useState("");

    
    const { loading, items, total_pages, total_items, refreshToggle } = useSelector(state => state.ads);

    let dispatch = useDispatch();
    let history = useHistory();
    let { path, url } = useRouteMatch();

    return (
        <div>
            <Modal isOpen={confirm} toggle={() => setConfirm(false)}>
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
                            dispatch(deleteAds(selectedRow, ));
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
                            dispatch(getAds( pageIndex, pageSize, search, agefSet, agetSet));
                            // eslint-disable-next-line react-hooks/exhaustive-deps
                        }, [dispatch,  refreshToggle, agefSet, agetSet])}
                        filters={[
                            {
                                button: <Button key="Set Age Range"
                                    label={(agefSet || agetSet) ?
                                        ("Age: " + (agefSet ? agefSet : 10) + " - " +
                                            (agetSet ? agetSet : 85)) : "Set Age Range"}
                                    selected={agefSet || agetSet}
                                />,
                                component: toggleModal =>
                                    <form style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                    }} onSubmit={() => {
                                        setAgefSet(agef);
                                        setAgetSet(aget);
                                        toggleModal();
                                    }} >
                                        <Input type="number" min={10}
                                            label="Age From" inputValue={agef}
                                            setInputValue={setAgef} />
                                        <Input type="number" max={85}
                                            label="Age To" inputValue={aget}
                                            setInputValue={setAget} />
                                        <Button label="Set" />
                                    </form>
                            },
                        ]}
                        actions={[
                            <Button key="Add Advertisement" label="Add Advertisement" icon={<FiPlus />}
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
                        onClickDetails={row => dispatch(getAdsDetails(row,  history, url))}
                    />
                </Route>
                <Route path={`${path}/add`}>
                    <Add />
                </Route>
                <Route path={`${path}/edit`}>
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
