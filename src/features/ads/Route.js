import React, { useCallback } from 'react';
import { useRouteMatch, Switch, Route, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Table from '../../components/Table';
import Button from '../../components/Button';
import { getAds, getAdsDetails, setSelected } from './slice';
import Details from './Details';
import Add from './Add';
import { FiPlus } from 'react-icons/fi';

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
    { Header: "Start Date", accessor: "start_date" },
    { Header: "End Date", accessor: "end_date" },
    { Header: "Status", accessor: "published" },
]

function Component() {
    const headers = useSelector(state => state.auth.headers);
    const { loading, items, total_pages } = useSelector(state => state.ads);

    let dispatch = useDispatch();
    let history = useHistory();
    let { path, url } = useRouteMatch();

    return (
        <div>
            <Switch>
                <Route exact path={path}>
                    <Table
                        columns={columns}
                        data={items}
                        loading={loading}
                        pageCount={total_pages}
                        fetchData={useCallback((pageIndex, pageSize, search) => {
                            dispatch(getAds(headers, pageIndex, pageSize, search));
                        }, [dispatch, headers])}
                        filters={[]}
                        actions={[
                            <Button key="Add" label="Add" icon={<FiPlus />}
                                onClick={() => {
                                    dispatch(setSelected({}));
                                    history.push(url + "/add");
                                }}
                            />
                        ]}
                        onClickDetails={row => dispatch(getAdsDetails(row, headers, history, url))}
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
