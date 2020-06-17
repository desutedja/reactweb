import React, { useEffect, useCallback, useState } from 'react';
import { FiSearch, FiPlus } from 'react-icons/fi';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { get } from '../../utils';
import Profile from '../../components/Profile';

import UserAvatar from '../../components/UserAvatar';
import Button from '../../components/Button';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import Link from '../../components/Link';
import Filter from '../../components/Filter';
import { toSentenceCase } from '../../utils';
import SectionSeparator from '../../components/SectionSeparator';

import {
    getResidentUnit,
    getSubaccount,
    addResidentUnit,
} from './slice';
import { endpointAdmin } from '../../settings';

const tabs = [
    'Unit', 'Sub Account'
]

const columnsUnit = [
    //{ Header: "ID", accessor: "unit_id" },
    { Header: "Building", accessor: "building_name" },
    { Header: "Unit Number", accessor: "number" },
    { Header: "Level", accessor: "level" },
    { Header: "Status", accessor: "status" },
    { Header: "Type", accessor: row => row.unit_type + " - " + row.unit_size },
]

const columnsSubaccount = [
    //{ Header: "ID", accessor: "id" },
    { Header: "Unit Number", accessor: "unit_number" },
    { Header: "Building", accessor: "building_name" },
    { Header: "Resident", accessor: row => 
    <UserAvatar fullname={row.firstname + " " + row.lastname} email={row.email} />},
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
    const [addUnit, setAddUnit] = useState(false);
    const [addUnitStep, setAddUnitStep] = useState(1);

    const [search, setSearch] = useState('');

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
    let { url } = useRouteMatch();

    const headers = useSelector(state => state.auth.headers);
    const fetchData = useCallback((pageIndex, pageSize, search) => {
        tab === 0 && dispatch(getResidentUnit(headers, pageIndex, pageSize, search, selected));
        tab === 1 && dispatch(getSubaccount(headers, pageIndex, pageSize, search, selected));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, refreshToggle, headers, tab])

    useEffect(() => {
        setBuildingLoading(true);
        addUnit && addUnitStep === 1 && (!search || search.length >= 3) && get(endpointAdmin + '/building' +
            '?page=1'+
            '&limit=10' +
            '&search=' + search,
            headers,
            res => {
                setBuildings(res.data.data.items);
                setBuildingPageCount(res.data.data.total_pages);

                setBuildingLoading(false);
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addUnit, addUnitStep, search, headers]);

    useEffect(() => {
        setUnitLoading(true);
        addUnit && addUnitStep === 2 && (!search || search.length >= 3) && get(endpointAdmin + '/building/unit' +
            '?page=1' + 
            '&building_id=' + selectedBuilding.value.id +
            '&search=' + search +
            '&limit=10',
            headers,
            res => {
                setUnits(res.data.data.items);
                setUnitPageCount(res.data.data.total_pages);

                setUnitLoading(false);
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [headers, addUnit, search, addUnitStep, selectedBuilding]);

    const backFunction = useCallback(() => setAddUnitStep(addUnitStep - 1), [addUnitStep]);

    const submitFunction = (e) => {
                            dispatch(addResidentUnit(headers, {
                                unit_id: selectedUnit.value.id,
                                owner_id: selected.id,
                                level: level,
                                status: status
                            }))
                            setAddUnit(false);
                            setAddUnitStep(1);}

    return (
        <div>
            <Modal isOpen={addUnit} title={ "Add Unit" }
            disableFooter={addUnitStep === 1} 
            okLabel = {addUnitStep !== 3 ? "Back" : "Add Unit"}
            cancelLabel = {"Back"}
            onClick={addUnitStep === 3 ? submitFunction : backFunction}
            onClickSecondary={backFunction}
            disablePrimary={addUnitStep !== 3}
            toggle={() => setAddUnit(false)}>
                {addUnitStep === 1 && <>
                    <Input label="Search Building"
                        compact
                        icon={<FiSearch />} 
                        inputValue={search} setInputValue={setSearch}
                    />
                    <Filter
                        data={buildings.map((el) => {
                            return { label: el.name, value: el };
                        })}
                        onClick={(el) => {
                            setSelectedBuilding(el);
                            setAddUnitStep(2);
                            setSearch('');
                        }}
                    />
                </>}
                {addUnitStep === 2 && <>
                    <Input type="button" inputValue={selectedBuilding.label} onClick={() => {}} />
                    <SectionSeparator />
                    <Input label="Search Unit Number"
                        compact
                        icon={<FiSearch />} 
                        inputValue={search} setInputValue={setSearch}
                    />
                    <Filter
                        data={units.map((el) => {
                            return { label: "Room " + el.number + " - " + toSentenceCase(el.section_type) + " " + el.section_name,
                               value: el };
                        })}
                        onClick={(el) => {
                            setSelectedUnit(el);
                            setAddUnitStep(3);
                            setSearch('');
                        }}
                    />
                </>}
                {addUnitStep === 3 && <>
                <form>
                        <Input type="button" inputValue={selectedBuilding.label} onClick={() => {

                        }} />
                        <Input type="button" inputValue={
                            "Room " +
                            selectedUnit.value.number + " - " +
                            toSentenceCase(selectedUnit.value.section_type) + " " +
                            selectedUnit.value.section_name + " "
                        } onClick={() => {

                        }} />
                        <SectionSeparator/>
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
                    </form>
                </>}
            </Modal>
            <div className="Container">
                <div className="Details" style={{}}>
                    {<Profile type="resident" email={selected['email']} phone={selected["phone"]}
                        title={selected['firstname'] + " " + selected["lastname"]} data={selected} />}
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
