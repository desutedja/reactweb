import React, { useState, useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import LabeledText from '../../components/LabeledText';
import Button from '../../components/Button';
import Table from '../../components/Table';
import { FiPlus } from 'react-icons/fi';
import { getAdsSchedule } from './slice';

const exception = [
    'created_on', 'modified_on', 'deleted',
    'content_image', 'content_description', 'Schedule',
    'default_priority_score', 'media_index', 'media_url',
    'published'
];

const tabs = [
    'Content', 'Schedules',
]

const columns = [
    { Header: "Day", accessor: "day" },
    { Header: "Hour From", accessor: "hour_from" },
    { Header: "Hour To", accessor: "hour_to" },
]

function Component() {
    const [tab, setTab] = useState(0);

    const headers = useSelector(state => state.auth.headers);
    const { selected, loading, schedule, refreshToggle } = useSelector(state => state.ads);

    let dispatch = useDispatch();
    let history = useHistory();
    let { path, url } = useRouteMatch();

    const fetchData = useCallback((pageIndex, pageSize, search) => {
        tab === 1 && dispatch(getAdsSchedule(headers, pageIndex, pageSize, search, selected));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, refreshToggle, headers, tab])

    return (
        <div>
            <div className="Container">
                <div className="Details" style={{

                }}>
                    {Object.keys(selected).filter(el => !exception.includes(el))
                        .map(el =>
                            <LabeledText
                                key={el}
                                label={el.length > 2 ? el.replace(/_/g, ' ') : el.toUpperCase()}
                                value={selected[el] ? (selected[el] + '').includes(':') ?
                                    selected[el].split('T')[0]
                                    : selected[el] : '-'}
                            />
                        )}
                </div>
                <div className="Photos">
                    <div style={{
                        display: 'flex'
                    }}>
                        <Button label="Create New" onClick={() => { }} />
                        <Button label="Preview" onClick={() => { }} />
                        <Button label="Edit" onClick={() => history.push(
                            url.split('/').slice(0, -1).join('/') + "/edit"
                        )} />
                    </div>
                    <Button disabled={selected.published}
                        label={selected.published ? "Published" : "Publish"} onClick={() => { }} />
                </div>
            </div>
            <div className="Container" style={{
                marginTop: 16,
                flex: 1,
                flexDirection: 'column',
            }}>
                <div className="Tab">
                    {tabs.map((el, index) =>
                        <div key={el} className="TabItem">
                            <button className="TabItem-Text"
                                onClick={() => setTab(index)}
                            >{el}</button>
                            {tab === index && <div className="TabIndicator"></div>}
                        </div>)}
                </div>
                {tab === 0 && <p>
                    <Button label="Edit" onClick={() => { }} />
                    <div style={{
                        display: 'flex',
                        marginTop: 16,
                        paddingLeft: 8,
                    }}>
                        <div style={{
                            flex: 1
                        }}>
                            {selected.content_image ?
                                <img className="Logo" src={selected.content_image} alt="content_image" />
                                :
                                <img src={'https://via.placeholder.com/200'} alt="content_image" />
                            }
                        </div>
                        <div style={{
                            flex: 3
                        }}>
                            <p style={{ fontWeight: 'bold', fontSize: '1.2rem', marginBottom: 8 }}>
                                {selected.content_name}
                            </p>
                            <p>{selected.content_description}</p>
                        </div>
                    </div>
                </p>}
                {tab === 1 && <Table
                    columns={columns}
                    data={schedule.items}
                    loading={loading}
                    pageCount={schedule.total_pages}
                    fetchData={fetchData}
                    filters={[]}
                    actions={[]}
                />}
            </div>
        </div>
    )
}

export default Component;