import React, { useCallback } from 'react';
import { useRouteMatch, Switch, Route, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import parse from 'html-react-parser';

import Table from '../../components/Table';
import Button from '../../components/Button';
import Add from './Add';
import Details from './Details';
import { getAnnoucement, getAnnouncementDetails, setSelected } from './slice';
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
    const headers = useSelector(state => state.auth.headers);
    const { loading, items, total_pages, total_items, refreshToggle, alert } = useSelector(state => state.announcement);

    let dispatch = useDispatch();
    let history = useHistory();
    let { path, url } = useRouteMatch();

    return (
        <div>
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
                            <Button key="Add" label="Add" icon={<FiPlus />}
                                onClick={() => {
                                    dispatch(setSelected({}));
                                    history.push(url + "/add");
                                }}
                            />,
                        ]}
                        onClickDetails={row => dispatch(getAnnouncementDetails(row, headers, history, url))}
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