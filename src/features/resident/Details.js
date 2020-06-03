import React, { useCallback, useState, useEffect } from 'react';
import { FiPlus, FiSearch } from 'react-icons/fi';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { dateFormatter, get, toSentenceCase } from '../../utils';

import LabeledText from '../../components/LabeledText';

import Button from '../../components/Button';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import Filter from '../../components/Filter';
import Input from '../../components/Input';
import Form from '../../components/Form';
import Link from '../../components/Link';

import {
    getResidentUnit,
    getSubaccount,
    addResidentUnit,
    setSelected
} from './slice';
import { endpointAdmin } from '../../settings';

const exception = [
    'modified_on', 'deleted', 'district', 'city', 'province'
];

const tabs = [
    'Unit', 'Sub Accounts'
]

const columnsUnit = [
    { Header: "ID", accessor: "unit_id" },
    { Header: "Building", accessor: "building_name" },
    { Header: "Unit Number", accessor: "number" },
    { Header: "Level", accessor: "level" },
    { Header: "Status", accessor: "status" },
    { Header: "Type", accessor: row => row.unit_type + " - " + row.unit_size },
]

const columnsSubaccount = [
    { Header: "ID", accessor: "id" },
    { Header: "Name", accessor: row => row.firstname + " " + row.lastname },
    { Header: "Building", accessor: "building_name" },
    { Header: "Unit Number", accessor: "unit_number" },
    { Header: "Email", accessor: "email" },
    { Header: "Phone", accessor: "phone" },
]

const buildingColumns = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Name', accessor: 'name' },
    { Header: 'Legal Name', accessor: 'legal_name' },
    { Header: 'Code Name', accessor: 'code_name' },
    { Header: 'Owner', accessor: 'owner_name' },
    { Header: 'Website', accessor: row => <Link>{row.website}</Link> },
    // { Header: 'Location', accessor: row => row.lat + ', ' + row.long },
]

const unitColumns = [
    { Header: "ID", accessor: "id" },
    { Header: "Number", accessor: "number" },
    { Header: "Floor", accessor: "floor" },
    { Header: "Section", accessor: "section_name" },
    { Header: "Type", accessor: row => row.unit_type_name + " - " + row.unit_size },
]


function Component() {
    const [tab, setTab] = useState(0);
    const [selectedRow, setRow] = useState({});

    const [addUnit, setAddUnit] = useState(false);
    const [addSub, setAddSub] = useState(false);

    const [edit, setEdit] = useState(false);
    const [search, setSearch] = useState('');

    const [addUnitStep, setAddUnitStep] = useState(1);

    const [selectedBuilding, setSelectedBuilding] = useState({});
    const [buildings, setBuildings] = useState([]);
    const [buildingLoading, setBuildingLoading] = useState(false);
    const [buildingPageCount, setBuildingPageCount] = useState(false);

    const [selectedUnit, setSelectedUnit] = useState({});
    const [units, setUnits] = useState([]);
    const [unitLoading, setUnitLoading] = useState(false);
    const [unitPageCount, setUnitPageCount] = useState(false);

    const [level, setLevel] = useState('main');
    const [status, setStatus] = useState('own');

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

    const getBuilding = useCallback((pageIndex, pageSize, search) => {
        setBuildingLoading(true);
        get(endpointAdmin + '/building' +
            '?page=' + (pageIndex + 1) +
            '&limit=' + pageSize +
            '&search=' + search,
            headers,
            res => {
                setBuildings(res.data.data.items);
                setBuildingPageCount(res.data.data.total_pages);

                setBuildingLoading(false);
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [headers]);

    const getUnit = useCallback((pageIndex, pageSize, search) => {
        setUnitLoading(true);
        get(endpointAdmin + '/building/unit' +
            '?page=' + (pageIndex + 1) +
            '&building_id=' + selectedBuilding.id +
            '&search=' + search +
            '&limit=' + pageSize,
            headers,
            res => {
                setUnits(res.data.data.items);
                setUnitPageCount(res.data.data.total_pages);

                setUnitLoading(false);
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [headers, selectedBuilding]);

    return (
        <div>
            <Modal isOpen={addUnit} onRequestClose={() => setAddUnit(false)}>
                {addUnitStep === 1 && <>
                    <p className="Title" style={{
                        marginBottom: 16
                    }}>Select Building</p>
                    <Table
                        columns={buildingColumns}
                        data={buildings}
                        loading={buildingLoading}
                        pageCount={buildingPageCount}
                        fetchData={getBuilding}
                        onClickResolve={row => {
                            setSelectedBuilding(row);
                            setAddUnitStep(2);
                        }}
                    />
                    <Button label="Cancel" secondary
                        onClick={() => setAddUnit(false)}
                    />
                </>}
                {addUnitStep === 2 && <>
                    <p className="Title" style={{
                        marginBottom: 16
                    }}>Select Unit</p>
                    <Table
                        columns={unitColumns}
                        data={units}
                        loading={unitLoading}
                        pageCount={unitPageCount}
                        fetchData={getUnit}
                        onClickResolve={row => {
                            setSelectedUnit(row);
                            setAddUnitStep(3);
                        }}
                    />
                    <Button label="Back" secondary
                        onClick={() => setAddUnitStep(1)}
                    />
                </>}
                {addUnitStep === 3 && <>
                    <p className="Title" style={{
                        marginBottom: 16
                    }}>Add Unit</p>
                    <form
                        onSubmit={e => {
                            dispatch(addResidentUnit(headers, {
                                unit_id: selectedUnit.id,
                                owner_id: selected.id,
                                level: level,
                                status: status
                            }))
                            setAddUnit(false);
                            setAddUnitStep(1);
                        }}
                    >
                        <Input type="button" inputValue={selectedBuilding.name} onClick={() => {

                        }} />
                        <Input type="button" inputValue={
                            selectedUnit.number + " F" +
                            selectedUnit.floor + " " +
                            selectedUnit.section_name + " " +
                            selectedUnit.unit_type_name + " - " + selectedUnit.unit_size
                        } onClick={() => {

                        }} />
                        <Input label="Level" type="select"
                            inputValue={level}
                            setInputValue={setLevel}
                            options={[
                                { value: 'main', label: 'Main' },
                                { value: 'sub', label: 'Sub' },
                            ]}
                        />
                        <Input label="Status" type="select"
                            inputValue={status}
                            setInputValue={setStatus}
                            options={[
                                { value: 'own', label: 'Own' },
                                { value: 'rent', label: 'Rent' },
                            ]}
                        />
                        <div style={{
                            display: 'flex',
                            marginTop: 16,
                        }}>
                            <Button label="Back" secondary
                                onClick={() => setAddUnitStep(2)}
                            />
                            <Button label="Add" />
                        </div>
                    </form>
                </>}
            </Modal>
            <div className="Container">
                <div className="Details" style={{

                }}>
                    {Object.keys(selected).filter(el => !exception.includes(el))
                        .map(el =>
                            <LabeledText
                                key={el}
                                label={el.length > 2 ? el.replace(/_/g, ' ') : el.toUpperCase()}
                                value={el === "created_on" ? dateFormatter(selected["created_on"])
                                    : toSentenceCase(selected[el] ? selected[el] + '' : '-')}
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
                            onClick={() => {
                                history.push(url + "/add-subaccount");
                            }}
                        />
                    ]}
                />}
            </div>
        </div>
    )
}

export default Component;
