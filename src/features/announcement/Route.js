import React, { useCallback, useState } from 'react';
import { useRouteMatch, Switch, Route, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import parse from 'html-react-parser';

import Table from '../../components/Table';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Add from './Add';
import Details from './Details';
import { getAnnoucement, getAnnouncementDetails, setSelected, deleteAnnouncement } from './slice';
import { FiPlus } from 'react-icons/fi';
import { toSentenceCase } from '../../utils';
import { Badge } from 'reactstrap';

const columns = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Title', accessor: 'title' },
    // { Header: 'Topic', accessor: row => toSentenceCase(row.topic) },
    { Header: 'Consumer', accessor: row => toSentenceCase(row.consumer_role.replace(/_/g, ' ')) },
    {
        Header: 'Description', accessor: row => row.description.length > 50 ?
            parse(row.description).slice(0, 50) + '...' : parse(row.description)
    },
    { Header: 'Publisher', accessor: 'publisher_name' },
    {
        Header: 'Status', accessor: row => row.publish ?
            <h5><Badge pill color="success">Published</Badge></h5>
            :
            <h5><Badge pill color="secondary">Draft</Badge></h5>
    },
]

function Component() {
    const [confirm, setConfirm] = useState(false);
    const [selectedRow, setRow] = useState({});

    const headers = useSelector(state => state.auth.headers);
    const { loading, items, total_pages, total_items, refreshToggle } = useSelector(state => state.announcement);

    let dispatch = useDispatch();
    let history = useHistory();
    let { path, url } = useRouteMatch();

    return (
        <div>
            <Modal isOpen={confirm} toggle={() => setConfirm(false)} disableHeader disableFooter >
                {selectedRow.publish ? <>
                    You cannot delete published announcement.
                </> : <>
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
                                    dispatch(deleteAnnouncement(selectedRow, headers));
                                }}
                            />
                        </div>
                    </>}
            </Modal>
            <Switch>
                <Route exact path={path}>
                    <Table totalItems={total_items}
                        columns={columns}
                        data={items}
                        loading={loading}
                        pageCount={total_pages}
                        fetchData={useCallback((pageIndex, pageSize, search) => {
                            dispatch(getAnnoucement(headers, pageIndex, pageSize, search));
                            // eslint-disable-next-line react-hooks/exhaustive-deps
                        }, [dispatch, refreshToggle, headers])}
                        filters={[]}
                        actions={[
                            <Button key="Add Announcement" label="Add Announcement" icon={<FiPlus />}
                                onClick={() => {
                                    dispatch(setSelected({}));
                                    history.push(url + "/add");
                                }}
                            />,
                        ]}
                        onClickDelete={row => {
                            setRow(row);
                            setConfirm(true);
                        }}
                        onClickDetails={row =>
                            dispatch(getAnnouncementDetails(row, headers, history, url))}
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
