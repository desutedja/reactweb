import React, { useCallback, useState, useEffect } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { dateFormatter } from '../../utils';

import LabeledText from '../../components/LabeledText';

import Button from '../../components/Button';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import Filter from '../../components/Filter';
import Input from '../../components/Input';
import Form from '../../components/Form';

import {
    getResidentUnit,
    getSubaccount
} from './slice';

const exception = [
    'modified_on', 'deleted',
];

const tabs = [
    'Unit', 'Sub Accounts'
]

const columnsUnit = [
    { Header: "ID", accessor: "unit_id" },
    { Header: "Building", accessor: "building_name" },
    { Header: "Room Number", accessor: "number" },
    { Header: "Level", accessor: "level" },
    { Header: "Status", accessor: "status" },
    { Header: "Type", accessor: row => row.unit_type + " - " + row.unit_size },
]

const columnsSubaccount = [
    { Header: "ID", accessor: "id" },
    { Header: "Name", accessor: row => row.firstname + " " + row.lastname },
    { Header: "Email", accessor: "email" },
    { Header: "Phone", accessor: "phone" },
]


function Component() {
    const [tab, setTab] = useState(0);
    const [selectedRow, setRow] = useState({});
    const [addUnit, setAddUnit] = useState(false);

    const [edit, setEdit] = useState(false);
    const [search, setSearch] = useState('');

    const { selected, unit, subaccount, loading, refreshToggle } = useSelector(state => state.resident);

    let dispatch = useDispatch();
    let history = useHistory();
    let { path, url } = useRouteMatch();

    const headers = useSelector(state => state.auth.headers);
    const fetchData = useCallback((pageIndex, pageSize) => {
        tab === 0 && dispatch(getResidentUnit(headers, pageIndex, pageSize, search, selected));
        tab === 1 && dispatch(getSubaccount(headers, pageIndex, pageSize, search, selected));
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
                                label={el.length > 2 ? el.replace('_', ' ') : el.toUpperCase()} value={el == "created_on" ? dateFormatter(selected["created_on"]) : selected[el]}
                            />
                        )}
                </div>
                <div className="Photos">
                    <Button label="Edit" onClick={() => history.push(
                        url.split('/').slice(0, -1).join('/') + "/edit"
                    )} />
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
                {tab === 0 && <Table
                    columns={columnsUnit}
                    data={unit.items}
                    loading={loading}
                    pageCount={unit.total_pages}
                    fetchData={fetchData}
                    filters={[]}
                    actions={[
                        <Button key="Add" label="Add" icon={<FiPlus />}
                            onClick={() => setAddUnit(true)}
                        />
                    ]}
                    onClickDelete={row => {
                        // setRow(row);
                        //dispatch(deleteResidentUnit(row, headers))
                        // setConfirm(true);
                    }}
                />}
                {tab === 1 && <Table
                    columns={columnsSubaccount}
                    data={subaccount.items}
                    loading={loading}
                    pageCount={subaccount.total_pages}
                    fetchData={fetchData}
                    filters={[]}
                    actions={[
                        <Button key="Add" label="Add" icon={<FiPlus />}
                            onClick={() => setAddUnit(true)}
                        />
                    ]}
                    onClickDelete={row => {
                        // setRow(row);
                        //dispatch(deleteResidentUnit(row, headers))
                        // setConfirm(true);
                    }}
                />}
            </div>
        </div>
    )
}

export default Component;
