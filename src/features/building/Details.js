import React, { useCallback, useState, useEffect } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import { toMoney, toSentenceCase } from '../../utils';
import { CustomInput } from 'reactstrap';

import Profile from '../../components/Profile';
import Table from '../../components/Table';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import Filter from '../../components/Filter';
import Form from '../../components/Form';

import {
    getBuildingUnit, getBuildingUnitType, getBuildingSection,
    editBuildingManagement, createBuildingManagement,
    createBuildingUnit, createBuildingUnitType, createBuildingSection,
    deleteBuildingUnit, deleteBuildingUnitType, deleteBuildingSection,
    editBuildingUnit, editBuildingUnitType, editBuildingSection,
    getBuildingService, getBuildingManagement, deleteBuildingManagement,
    deleteBuildingService, createBuildingService, editBuildingService,
} from './slice';
import { endpointAdmin, banks } from '../../settings';
import { get } from '../../utils';

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
    { Header: "Section", accessor: row => toSentenceCase(row.section_type) + " " + row.section_name },
    {
        Header: "Type", accessor: row => <div>
            {(row.unit_type_name.length > 3 ? toSentenceCase(row.unit_type_name)
            : row.unit_type_name.toUpperCase()) + " - "}
            {row.unit_size + ' m'}<sup>2</sup>
            </div>
    },
]

const columnsUnitType = [
    { Header: "ID", accessor: "id" },
    {
        Header: "Type Name", accessor: row => row.unit_type.length > 3 ? toSentenceCase(row.unit_type)
            : row.unit_type.toUpperCase()
    },
    {
        Header: "Size", accessor: row => <div>
            {row.unit_size + ' m'}<sup>2</sup>
        </div>
    },
]

const columnsSection = [
    { Header: "ID", accessor: "id" },
    { Header: "Name", accessor: "section_name" },
    { Header: "Type", accessor: row => toSentenceCase(row.section_type) },
]

const columnsService = [
    { Header: "ID", accessor: "id" },
    { Header: "Name", accessor: "name" },
    { Header: "Group", accessor: row => row.group === 'ipl' ? 'IPL' : 'Non-IPL' },
    { Header: "Description", accessor: row => row.description ? row.description : '-' },
    {
        Header: "Price", accessor: (row) => {
            return (row.price_fixed > 0 ? toMoney(row.price_fixed) + " (Fixed)" : toMoney(row.price_unit) + " / " + row.denom_unit)
        },

    },
    {
        Header: "Tax", accessor: row => (row.tax === "percentage" ?
            row.tax_value + "%" : toMoney(row.tax_amount) + " (Fixed)")
    },
]

const columnsManagement = [
    { Header: "ID", accessor: "id" },
    { Header: "Management_name", accessor: "management_name" },
    { Header: "Billing Duedate", accessor: "billing_duedate" },
    { Header: "Billing Published", accessor: "billing_published" },
    { Header: "Courier Fee", accessor: row => toMoney(row.courier_fee)},
    { Header: "Internal Courier Markup", accessor: row => toMoney(row.courier_internal_markup)},
    { Header: "External Courier Markup", accessor: row => toMoney(row.courier_external_markup)},
    { Header: "Penalty Fee", accessor: row => toMoney(row.penalty_fee)},
    { Header: "Settlement Account Name", accessor: "settlement_account_name" },
    { Header: "Settlement Account No", accessor: "settlement_account_no" },
    { Header: "Settlement Bank", accessor: row => row.settlement_bank.toUpperCase() },
    {
        Header: "Status",
        accessor: row => <CustomInput type="switch" label={row.status} id={"managementStatus-" + row.id}
            checked={row.status === "active"} />
    },
]

function Component() {
    const [selectedRow, setRow] = useState({});
    const [tab, setTab] = useState(0);

    const [confirm, setConfirm] = useState(false);
    const [edit, setEdit] = useState(false);

    const [addUnit, setAddUnit] = useState(false);
    const [addUnitType, setAddUnitType] = useState(false);
    const [addSection, setAddSection] = useState(false);
    const [addManagement, setAddManagement] = useState(false);
    const [addService, setAddService] = useState(false);

    const [sectionID, setSectionID] = useState('');
    const [unitTypeID, setUnitTypeID] = useState('');
    const [floor, setFloor] = useState('');
    const [number, setNumber] = useState('');

    const [priceType, setPriceType] = useState('fixed');
    const [taxType, setTaxType] = useState('percentage');

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
    let { url } = useRouteMatch();

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
            <Modal disableFooter={false} isOpen={confirm} toggle={() => setConfirm(false)}>
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
            <Modal disableFooter={false} okLabel={edit ? "Save" : "Add"} title={edit ? "Edit Unit" : "Add Unit"}
                isOpen={addUnit} toggle={() => setAddUnit(false)}
                onClick={() => {
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
                <form>
                    <Input label="Number" inputValue={selectedRow.number ? selectedRow.number : number}
                        setInputValue={setNumber} disabled={edit} />
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
                        justifyContent: 'center',
                    }}>
                    </div>
                </form>
            </Modal>
            <Modal isOpen={addUnitType} toggle={() => setAddUnitType(false)} title={edit ? "Edit Unit Type" : "Add Unit Type"}
                okLabel={edit ? "Save" : "Add"}
                onClick={() => {
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
                }}
            >
                <form >
                    <Input label="Type Name"
                        inputValue={selectedRow.unit_type ? selectedRow.unit_type : typeName}
                        setInputValue={setTypeName}
                        type="select" options={unitTypes}
                        disabled={edit}
                    />
                    <Input label="Type Size"
                        inputValue={selectedRow.unit_size ? selectedRow.unit_size : typeSize}
                        setInputValue={setTypeSize} />
                    <div style={{
                        display: 'flex',
                        marginTop: 16,
                        justifyContent: 'center',
                    }}>
                    </div>
                </form>
            </Modal>
            <Modal isOpen={addSection} toggle={() => setAddSection(false)} title={edit ? "Edit Section" : "Add Section"}
                okLabel={edit ? "Save" : "Add"}
                onClick={() => {
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
                }}
            >
                <form >
                    <Input label="Section Name"
                        inputValue={selectedRow.section_name ? selectedRow.section_name : sectionName}
                        setInputValue={setSectionName} disabled={edit} />
                    <Input label="Section Type"
                        inputValue={selectedRow.section_type ? selectedRow.section_type : sectionType}
                        setInputValue={setSectionType}
                        type="select" options={sectionTypes}
                    />
                    <div style={{
                        display: 'flex',
                        marginTop: 16,
                        justifyContent: 'center',
                    }}>
                    </div>
                </form>
            </Modal>
            <Modal isOpen={addManagement} toggle={() => setAddManagement(false)} title={edit ? "Edit Management" : "Add Management"}
                okLabel={edit ? "Save" : "Add"} >
                <Form isModal={true} onSubmit={data => {
                    edit ?
                        dispatch(editBuildingManagement(headers, {
                            "building_id": selected.id, building_name: selected.name, ...data,
                        }, selectedRow.id))
                        :
                        dispatch(createBuildingManagement(headers, {
                            "building_id": selected.id, building_name: selected.name, ...data,
                        }))
                    setAddManagement(false);
                    setEdit(false);
                    setRow({});
                }}>
                    <Modal disableFooter={true} isOpen={modalManagement} toggle={() => setModalManagement(false)}>
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
                    <Input label="Management: All" type="button"
                        inputValue={managementName ? managementName : selectedRow.management_name}
                        onClick={() => setModalManagement(true)}
                        disabled={edit}
                    />
                    <Input label="Status" type="select" inputValue={selectedRow.status}
                        options={[
                            { label: 'Active', value: 'active' },
                            { label: 'Inactive', value: 'inactive' },
                        ]} />
                    <Input label="Settlement Bank" type="select" options={banks} inputValue={selectedRow.settlement_bank} />
                    <Input label="Settlement Account No" inputValue={selectedRow.settlement_account_no} />
                    <Input label="Settlement Account Name"
                        inputValue={selectedRow.settlement_account_name} />
                    <Input label="Billing Published (Date)" name="billing_published" type="number"
                        inputValue={selectedRow.billing_published}
                    />
                    <Input label="Billing Due (Date)" name="billing_duedate" type="number"
                        inputValue={selectedRow.billing_duedate} />
                    <Input label="Penalty Fee" type="number"
                        inputValue={selectedRow.penalty_fee} />
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
            <Modal isOpen={addService} toggle={() => setAddService(false)} title={edit ? "Edit Service" : "Add Service"}
                okLabel={edit ? "Save" : "Add"}
                onClick={data => {
                    edit ?
                        dispatch(editBuildingService(headers, {
                            "building_id": selected.id, building_name: selected.name, ...data,
                        }, selectedRow.id))
                        : dispatch(createBuildingService(headers, { ...data, building_id: selected.id }));

                    setAddService(false);
                    setEdit(false);
                    setRow({});
                }}
            >
                <form >
                    <Input label="Name" inputValue={selectedRow.name} />
                    <Input label="Group" type="select" inputValue={selectedRow.group} options={[
                        { value: 'ipl', label: 'IPL' },
                        { value: 'nonipl', label: 'Non-IPL' },
                    ]} />
                    <Input label="Description" inputValue={selectedRow.description} />
                    <Input label="Price Type" type="select" inputValue={priceType ? priceType : selectedRow.price_type} options={[
                        { value: 'unit', label: 'Unit' },
                        { value: 'fixed', label: 'Fixed' },
                    ]} setInputValue={setPriceType} />
                    <Input label="Price" name="price_unit" type="number"
                        hidden={priceType === 'fixed'} inputValue={selectedRow.price_unit} />
                    <Input label="Unit" placeholder="Denom Unit Name, ex: kWh, m^3" name="denom_unit"
                        hidden={priceType === 'fixed'} inputValue={selectedRow.denom_unit}
                    />
                    <Input label="Price" name="price_fixed" type="number"
                        hidden={priceType === 'unit'} inputValue={selectedRow.price_fixed} />
                    <Input label="Tax Type" name="tax" type="select"
                        options={[
                            { value: 'value', label: 'Value' },
                            { value: 'percentage', label: 'Percentage' },
                        ]}
                        setInputValue={setTaxType} inputValue={taxType ? taxType : selectedRow.tax} />
                    <Input label="Tax Value" hidden={taxType === 'value'} inputValue={selectedRow.tax_value} />
                    <Input label="Tax Amount" hidden={taxType === 'percentage'} inputValue={selectedRow.tax_amount} />
                </form>
            </Modal>
            <div className="Container" style={{
                flex: 3,
                marginRight: 16,
            }}>

                <div className="Details">
                    <Profile type="building" title={selected["name"]} website={selected["website"]} picture={selected["logo"]}
                        data={selected} />
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
                            <button className={tab === index ? "TabItem-Text" : "TabItem-Text-inactive"}
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
                    totalItems={unit.total_items}
                    fetchData={fetchData}
                    filters={[]}
                    actions={[
                        <Button key="Add Unit" label="Add Unit" icon={<FiPlus />}
                            onClick={() => {
                                setEdit(false);
                                setRow({});
                                setSectionID('');
                                setUnitTypeID('');
                                setFloor('');
                                setNumber('');

                                setAddUnit(true);
                            }}
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
                    totalItems={unit_type.total_items}
                    fetchData={fetchData}
                    filters={[
                        {
                            hidex: !utNameFilter.label,
                            label: <p>{utNameFilter.label ? "Name: " + utNameFilter.label : "Name: All"}</p>,
                            delete: () => { setUtNameFilter({}); },
                            component: (toggleModal) =>
                                <Filter
                                    data={unitTypes}
                                    onClick={(el) => {
                                        setUtNameFilter(el);
                                        toggleModal(false);
                                    }}
                                    onClickAll={() => {
                                        setUtNameFilter({});
                                        toggleModal(false);
                                    }}
                                />
                        },
                    ]}
                    actions={[
                        <Button key="Add Unit Type" label="Add Unit Type" icon={<FiPlus />}
                            onClick={() => {
                                setEdit(false);
                                setRow({});
                                setTypeName('');
                                setTypeSize('');

                                setAddUnitType(true);
                            }}
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
                    totalItems={section.total_items}
                    fetchData={fetchData}
                    filters={[
                        {
                            hidex: !sTypeFilter.label,
                            label: <p>{sTypeFilter.label ? "Type: " + sTypeFilter.label : "Type: All"}</p>,
                            delete: () => { setSTypeFilter({}); },
                            component: (toggleModal) =>
                                <Filter
                                    data={sectionTypes}
                                    onClick={(el) => {
                                        setSTypeFilter(el);
                                        toggleModal(false);
                                    }}
                                    onClickAll={() => {
                                        setSTypeFilter({});
                                        toggleModal(false);
                                    }}
                                />
                        },
                    ]}
                    actions={[
                        <Button key="Add Section" label="Add Section" icon={<FiPlus />}
                            onClick={() => {
                                setEdit(false);
                                setRow({});
                                setSectionName('');
                                setSectionType('');

                                setAddSection(true);
                            }}
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
                    totalItems={service.total_items}
                    filters={[
                        {
                            button: <Button key="Group: All"
                                label={sGroupFilter.label ? sGroupFilter.label : "Group: All"}
                                selected={sGroupFilter.label}
                            />,
                            hidex: !sGroupFilter.label,
                            label: <p>{sGroupFilter.label ? "Group: " + sGroupFilter.label : "Group: All"}</p>,
                            delete: () => { setSGroupFilter({}); },
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
                    actions={[
                        <Button key="Add Billing Service" label="Add Billing Service" icon={<FiPlus />}
                            onClick={() => {
                                setEdit(false);
                                setRow({});

                                setAddService(true);
                            }}
                        />
                    ]}
                    onClickEdit={row => {
                        setRow(row);
                        console.log(row);
                        setPriceType(row.price_fixed > 0 ? 'fixed' : 'unit');
                        setTaxType(row.tax);
                        setEdit(true);
                        setAddService(true);
                    }}
                    onClickDelete={row => {
                        // setRow(row);
                        dispatch(deleteBuildingService(row, headers))
                        // setConfirm(true);
                    }}
                />}
                {tab === 4 && <Table
                    columns={columnsManagement}
                    data={management.items}
                    loading={loading}
                    pageCount={management.total_pages}
                    totalItems={management.total_items}
                    fetchData={fetchData}
                    filters={[]}
                    actions={[
                        <Button key="Add Building Management" label="Add Building Management" icon={<FiPlus />}
                            onClick={() => {
                                setEdit(false);
                                setRow({});
                                setAddManagement(true);
                            }}
                        />
                    ]}
                    onClickDelete={row => {
                        setRow(row);
                        dispatch(deleteBuildingManagement(row, headers))
                        setConfirm(true);
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
