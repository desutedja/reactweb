import React, { useCallback, useState, useEffect } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { dateFormatter } from '../../utils';

import LabeledText from '../../components/LabeledText';
import Table from '../../components/Table';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import Filter from '../../components/Filter';
import Form from '../../components/Form';
import SectionSeparator from '../../components/SectionSeparator';

import {
    getBuildingUnit, getBuildingUnitType, getBuildingSection,
    editBuildingManagement, createBuildingManagement,
    createBuildingUnit, createBuildingUnitType, createBuildingSection,
    deleteBuildingUnit, deleteBuildingUnitType, deleteBuildingSection, 
    editBuildingUnit, editBuildingUnitType, editBuildingSection, 
    getBuildingService, getBuildingManagement, deleteBuildingManagement,
} from './slice';
import { endpointAdmin } from '../../settings';
import { get } from '../../utils';


const exception = [
    'modified_on', 'deleted',
    'Tasks', 'lat', 'long', 'logo'
];

const tabs = [
    'Unit', 'Unit Type', 'Section', 'Service', 'Management'
]

const unitTypes = [
    { label: 'Studio', value: 'studio' },
    { label: '1BR', value: '1BR' },
    { label: '2BR', value: '2BR' },
    { label: '3BR', value: '3BR' },
    { label: '4BR', value: '4BR' },
    { label: '5BR', value: '5BR' },
]

const sectionTypes = [
    { label: 'Tower', value: 'tower' },
    { label: 'Wing', value: 'wing' },
]

const serviceGroup = [
    { label: 'IPL', value: 'ipl' },
    { label: 'Non-IPL', value: 'nonipl' },
]

const columnsUnit = [
    { Header: "ID", accessor: "id" },
    { Header: "Number", accessor: "number" },
    { Header: "Floor", accessor: "floor" },
    { Header: "Section", accessor: "section_name" },
    { Header: "Type", accessor: row => row.unit_type_name + " - " + row.unit_size },
]

const columnsUnitType = [
    { Header: "ID", accessor: "id" },
    { Header: "Name", accessor: row => row.unit_type + " - " + row.unit_size },
    { Header: "Type Name", accessor: "unit_type" },
    {
        Header: "Size", accessor: row => <div>
            {row.unit_size + ' m'}<sup>2</sup>
        </div>
    },
]

const columnsSection = [
    { Header: "ID", accessor: "id" },
    { Header: "Name", accessor: "section_name" },
    { Header: "Type", accessor: "section_type" },
]

const columnsService = [
    { Header: "ID", accessor: "id" },
    { Header: "Name", accessor: "name" },
    { Header: "Group", accessor: "group" },
    { Header: "Description", accessor: "description" },
    { Header: "Denom Unit", accessor: "denom_unit" },
    { Header: "Price Fixed", accessor: "price_fixed" },
    { Header: "Price Unit", accessor: "price_unit" },
    { Header: "Tax", accessor: "tax" },
    { Header: "Tax Amount", accessor: "tax_amount" },
    { Header: "Tax Value", accessor: "tax_value" },
]

const columnsManagement = [
    { Header: "ID", accessor: "id" },
    { Header: "Management_name", accessor: "management_name" },
    { Header: "Billing Duedate", accessor: "billing_duedate" },
    { Header: "Billing Published", accessor: "billing_published" },
    { Header: "Courier Fee", accessor: "courier_fee" },
    { Header: "Courier Internal Markup", accessor: "courier_internal_markup" },
    { Header: "Courier External Markup", accessor: "courier_external_markup" },
    { Header: "Penalty Fee", accessor: "penalty_fee" },
    { Header: "Settlement Account Name", accessor: "settlement_account_name" },
    { Header: "Settlement Account No", accessor: "settlement_account_no" },
    { Header: "Settlement Bank", accessor: "settlement_bank" },
    { Header: "Status", accessor: "status" },
]

function Component() {
    const [selectedRow, setRow] = useState({});
    const [tab, setTab] = useState(0);

    const [confirm, setConfirm] = useState(false);
    const [addUnit, setAddUnit] = useState(false);
    const [addUnitType, setAddUnitType] = useState(false);
    const [addSection, setAddSection] = useState(false);
    const [addManagement, setAddManagement] = useState(false);

    const [edit, setEdit] = useState(false);

    const [sectionID, setSectionID] = useState('');
    const [unitTypeID, setUnitTypeID] = useState('');
    const [floor, setFloor] = useState('');
    const [number, setNumber] = useState('');

    const [typeName, setTypeName] = useState('');
    const [typeSize, setTypeSize] = useState('');

    const [sectionType, setSectionType] = useState('');
    const [sectionName, setSectionName] = useState('');

    const [search, setSearch] = useState('');
    const [managementID, setManagementID] = useState('');
    const [managementName, setManagementName] = useState('');
    const [modalManagement, setModalManagement] = useState(false);
    const [managements, setManagements] = useState([]);

    const [utNameFilter, setUtNameFilter] = useState({});
    const [sTypeFilter, setSTypeFilter] = useState({});
    const [sGroupFilter, setSGroupFilter] = useState({});

    const headers = useSelector(state => state.auth.headers);
    const { selected, unit, unit_type, section, service, management,
        loading, refreshToggle } = useSelector(state => state.building);

    let dispatch = useDispatch();
    let history = useHistory();
    let { path, url } = useRouteMatch();

    const fetchData = useCallback((pageIndex, pageSize, search) => {
        tab === 0 && dispatch(getBuildingUnit(headers, pageIndex, pageSize, search, selected));
        tab === 1 && dispatch(getBuildingUnitType(headers, pageIndex, pageSize, search, selected, utNameFilter.value));
        tab === 2 && dispatch(getBuildingSection(headers, pageIndex, pageSize, search, selected, sTypeFilter.value));
        tab === 3 && dispatch(getBuildingService(headers, pageIndex, pageSize, search, selected, sGroupFilter.value));
        tab === 4 && dispatch(getBuildingManagement(headers, pageIndex, pageSize, search, selected));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, refreshToggle, headers, tab, utNameFilter, sTypeFilter, sGroupFilter])

    useEffect(() => {
        dispatch(getBuildingUnitType(headers, 0, 10, '', selected));
        dispatch(getBuildingSection(headers, 0, 10, '', selected));
    }, [dispatch, headers, selected]);

    useEffect(() => {
        (!search || search >= 3) && get(endpointAdmin + '/management' +
            '?limit=5&page=1' +
            '&search=' + search, headers, res => {
                let data = res.data.data.items;

                let formatted = data.map(el => ({ label: el.name, value: el.id }));

                setManagements(formatted);
            })
    }, [headers, search]);

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
                            // dispatch(deleteBuilding(selectedRow, headers));
                        }}
                    />
                </div>
            </Modal>
            <Modal isOpen={addUnit} onRequestClose={() => setAddUnit(false)}>
                {edit ? "Edit Unit" : "Add Unit"}
                <form
                    onSubmit={() => {
                        edit ?
                            dispatch(editBuildingUnit(headers, {
                                "building_id": selected.id,
                                "building_section": parseFloat(sectionID ? sectionID : selectedRow.building_section),
                                "unit_type": parseFloat(unitTypeID ? unitTypeID : selectedRow.unit_type),
                                "floor": parseFloat(floor ? floor : selectedRow.floor),
                                "number": number ? number : selectedRow.number,
                            }, selectedRow.id))
                            :
                            dispatch(createBuildingUnit(headers, {
                                "building_id": selected.id,
                                "building_section": parseFloat(sectionID),
                                "unit_type": parseFloat(unitTypeID),
                                "floor": parseFloat(floor),
                                "number": number,
                            }))
                        setAddUnit(false);
                        setEdit(false);
                        setRow({});
                        setSectionID('');
                        setUnitTypeID('');
                        setFloor('');
                        setNumber('');
                    }}
                >
                    <Input label="Number" inputValue={selectedRow.number ? selectedRow.number : number}
                        setInputValue={setNumber} />
                    <Input label="Floor" inputValue={selectedRow.floor ? selectedRow.floor : floor}
                        setInputValue={setFloor} />
                    <Input label="Section" type="select"
                        inputValue={selectedRow.building_section ? selectedRow.building_section : sectionID}
                        setInputValue={setSectionID}
                        options={section.items.map(el => ({
                            label: el.section_name,
                            value: el.id
                        }))}
                    />
                    <Input label="Unit Type" type="select"
                        inputValue={selectedRow.unit_type ? selectedRow.unit_type : unitTypeID}
                        setInputValue={setUnitTypeID}
                        options={unit_type.items.map(el => ({
                            label: el.unit_type + ' - ' + el.unit_size,
                            value: el.id
                        }))}
                    />
                    <div style={{
                        display: 'flex',
                        marginTop: 16,
                    }}>
                        <Button label="Cancel" secondary
                            onClick={() => setAddUnit(false)}
                        />
                        <Button label={edit ? "Save" : "Add"} />
                    </div>
                </form>
            </Modal>
            <Modal isOpen={addUnitType} onRequestClose={() => setAddUnitType(false)}>
                {edit ? "Edit" : "Add"} Unit Type
                <form onSubmit={() => {
                    edit ?
                        dispatch(editBuildingUnitType(headers, {
                            "building_id": selected.id,
                            "unit_type": typeName ? typeName : selectedRow.unit_type,
                            "unit_size": parseFloat(typeSize ? typeSize : selectedRow.unit_size),
                        }, selectedRow.id))
                        :
                        dispatch(createBuildingUnitType(headers, {
                            "building_id": selected.id,
                            "unit_type": typeName ? typeName : selectedRow.unit_type,
                            "unit_size": parseFloat(typeSize ? typeSize : selectedRow.unit_size),
                        }))
                    setAddUnitType(false);
                    setEdit(false);
                    setRow({});
                    setTypeName('');
                    setTypeSize('');
                }}>
                    <Input label="Type Name"
                        inputValue={selectedRow.unit_type ? selectedRow.unit_type : typeName}
                        setInputValue={setTypeName}
                        type="select" options={unitTypes}
                    />
                    <Input label="Type Size"
                        inputValue={selectedRow.unit_size ? selectedRow.unit_size : typeSize}
                        setInputValue={setTypeSize} />
                    <div style={{
                        display: 'flex',
                        marginTop: 16,
                    }}>
                        <Button label="Cancel" secondary
                            onClick={() => setAddUnitType(false)}
                        />
                        <Button label={edit ? "Save" : "Add"} />
                    </div>
                </form>
            </Modal>
            <Modal isOpen={addSection} onRequestClose={() => setAddSection(false)}>
                {edit ? "Edit" : "Add"} Section
                <form onSubmit={() => {
                    edit ?
                        dispatch(editBuildingSection(headers, {
                            "building_id": selected.id,
                            "section_type": sectionType ? sectionType : selectedRow.section_type,
                            "section_name": sectionName ? sectionName : selectedRow.section_name,
                        }, selectedRow.id))
                        :
                        dispatch(createBuildingSection(headers, {
                            "building_id": selected.id,
                            "section_type": sectionType ? sectionType : selectedRow.section_type,
                            "section_name": sectionName ? sectionName : selectedRow.section_name,
                        }))
                    setAddSection(false);
                    setEdit(false);
                    setRow({});
                    setSectionName('');
                    setSectionType('');
                }}>

                    <div style={{
                        display: 'flex',
                        marginTop: 16,
                    }}>
                        <Button label="Cancel" secondary
                            onClick={() => setAddSection(false)}
                        />
                        <Button label={edit ? "Save" : "Add"} />
                    </div>
                </form>
            </Modal>
            <Modal isOpen={addManagement} onRequestClose={() => setAddManagement(false)}>
                {edit ? "Edit" : "Add"} Management
                <Form
                    onSubmit={data => {
                        edit ?
                            dispatch(editBuildingManagement(headers, {
                                "building_id": selected.id, ...data,
                            }, selectedRow.id))
                            :
                            dispatch(createBuildingManagement(headers, {
                                "building_id": selected.id, ...data,
                            }))
                        setAddManagement(false);
                        setEdit(false);
                        setRow({});
                    }}
                    loading={loading}
                >
                    <Modal isOpen={modalManagement} onRequestClose={() => setModalManagement(false)}>
                        <Input label="Search"
                            inputValue={search} setInputValue={setSearch}
                        />
                        <Filter
                            data={managements}
                            onClick={(el) => {
                                setManagementID(el.value);
                                setManagementName(el.label);
                                setModalManagement(false);
                            }}
                        />
                    </Modal>
                    <Input label="Management ID" hidden
                        inputValue={managementID ? managementID : selectedRow.management_id}
                        setInputValue={setManagementID}
                    />
                    <Input label="Management Name" hidden
                        inputValue={managementName ? managementName : selectedRow.management_name}
                        setInputValue={setManagementName}
                    />
                    <Input label="Select Management" type="button"
                        inputValue={managementName ? managementName : selectedRow.management_name}
                        onClick={() => setModalManagement(true)}
                    />
                    <Input label="Status" type="select" inputValue={selectedRow.status}
                        options={[
                            { label: 'Active', value: 'active' },
                            { label: 'Inactive', value: 'inactive' },
                        ]} />
                    <SectionSeparator />
                    <Input label="Settlement Bank" inputValue={selectedRow.settlement_bank} />
                    <Input label="Settlement Account No" inputValue={selectedRow.settlement_account_no} />
                    <Input label="Settlement Account Name"
                        inputValue={selectedRow.settlement_account_name} />
                    <SectionSeparator />
                    <Input label="Billing Published (Date)" name="billing_published" type="number"
                        inputValue={selectedRow.billing_published}
                    />
                    <Input label="Billing Due (Date)" name="billing_duedate" type="number"
                        inputValue={selectedRow.billing_duedate} />
                    <Input label="Penalty Fee" type="number"
                        inputValue={selectedRow.penalty_fee} />
                    <SectionSeparator />
                    <Input label="Courier Fee" type="number"
                        inputValue={selectedRow.courier_fee}
                    />
                    <Input label="Courier Internal Markup" type="number"
                        inputValue={selectedRow.courier_internal_markup}
                    />
                    <Input label="Courier External Markup" type="number"
                        inputValue={selectedRow.courier_external_markup}
                    />
                </Form>
            </Modal>
            <div style={{
                display: 'flex'
            }}>
                <div className="Container" style={{
                    flex: 3,
                    marginRight: 16,
                }}>

                    <div className="Details">
                        {Object.keys(selected).filter(el => !exception.includes(el))
                            .map(el =>
                                <LabeledText
                                    key={el}
                                    label={el.length > 2 ? el.replace('_', ' ') : el.toUpperCase()}
                                    value={el == "created_on" ? dateFormatter(selected["created_on"]) : selected[el]}
                                />
                            )}
                    </div>
                    <div className="Photos">
                        <Button label="Edit" onClick={() => history.push(
                            url.split('/').slice(0, -1).join('/') + "/edit"
                        )} />
                        {selected.logo ?
                            <img className="Logo" src={selected.logo} alt="logo" />
                            :
                            <img src={'https://via.placeholder.com/200'} alt="logo" />
                        }
                    </div>
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
                        dispatch(deleteBuildingUnit(row, headers))
                        // setConfirm(true);
                    }}
                    onClickEdit={row => {
                        setRow(row);
                        setEdit(true);
                        setAddUnit(true);
                    }}
                />}
                {tab === 1 && <Table
                    columns={columnsUnitType}
                    data={unit_type.items}
                    loading={loading}
                    pageCount={unit_type.total_pages}
                    fetchData={fetchData}
                    filters={[
                        {
                            button: <Button key="Select Name"
                                label={utNameFilter.label ? utNameFilter.label : "Select Name"}
                                selected={utNameFilter.label}
                            />,
                            component: (toggleModal) =>
                                <Filter
                                    data={unitTypes}
                                    onClick={(el) => {
                                        setUtNameFilter(el);
                                        toggleModal(false);
                                    }}
                                    onClickAll={() => {
                                        setUtNameFilter("");
                                        toggleModal(false);
                                    }}
                                />
                        },
                    ]}
                    actions={[
                        <Button key="Add" label="Add" icon={<FiPlus />}
                            onClick={() => setAddUnitType(true)}
                        />
                    ]}
                    onClickDelete={row => {
                        // setRow(row);
                        dispatch(deleteBuildingUnitType(row, headers))
                        // setConfirm(true);
                    }}
                    onClickEdit={row => {
                        setRow(row);
                        setEdit(true);
                        setAddUnitType(true);
                    }}
                />}
                {tab === 2 && <Table
                    columns={columnsSection}
                    data={section.items}
                    loading={loading}
                    pageCount={section.total_pages}
                    fetchData={fetchData}
                    filters={[
                        {
                            button: <Button key="Select Type"
                                label={sTypeFilter.label ? sTypeFilter.label : "Select Type"}
                                selected={sTypeFilter.label}
                            />,
                            component: (toggleModal) =>
                                <Filter
                                    data={sectionTypes}
                                    onClick={(el) => {
                                        setSTypeFilter(el);
                                        toggleModal(false);
                                    }}
                                    onClickAll={() => {
                                        setSTypeFilter("");
                                        toggleModal(false);
                                    }}
                                />
                        },
                    ]}
                    actions={[
                        <Button key="Add" label="Add" icon={<FiPlus />}
                            onClick={() => setAddSection(true)}
                        />
                    ]}
                    onClickDelete={row => {
                        // setRow(row);
                        dispatch(deleteBuildingSection(row, headers))
                        // setConfirm(true);
                    }}
                    onClickEdit={row => {
                        setRow(row);
                        setEdit(true);
                        setAddSection(true);
                    }}
                />}
                {tab === 3 && <Table
                    columns={columnsService}
                    data={service.items}
                    loading={loading}
                    pageCount={service.total_pages}
                    fetchData={fetchData}
                    filters={[
                        {
                            button: <Button key="Select Group"
                                label={sGroupFilter.label ? sGroupFilter.label : "Select Group"}
                                selected={sGroupFilter.label}
                            />,
                            component: (toggleModal) =>
                                <Filter
                                    data={serviceGroup}
                                    onClick={(el) => {
                                        setSGroupFilter(el);
                                        toggleModal(false);
                                    }}
                                    onClickAll={() => {
                                        setSGroupFilter("");
                                        toggleModal(false);
                                    }}
                                />
                        },
                    ]}
                    actions={[]}
                />}
                {tab === 4 && <Table
                    columns={columnsManagement}
                    data={management.items}
                    loading={loading}
                    pageCount={management.total_pages}
                    fetchData={fetchData}
                    filters={[]}
                    actions={[
                        <Button key="Add" label="Add" icon={<FiPlus />}
                            onClick={() => setAddManagement(true)}
                        />
                    ]}
                    onClickDelete={row => {
                        // setRow(row);
                        dispatch(deleteBuildingManagement(row, headers))
                        // setConfirm(true);
                    }}
                    onClickEdit={row => {
                        setRow(row);
                        setEdit(true);
                        setAddManagement(true);
                    }}
                />}
            </div>
        </div>
    )
}

export default Component;
