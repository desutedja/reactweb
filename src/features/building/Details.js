import React, { useCallback, useState, useEffect } from 'react';

import LabeledText from '../../components/LabeledText';
import Table from '../../components/Table';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import { useSelector, useDispatch } from 'react-redux';
import {
    getBuildingUnit, getBuildingUnitType, getBuildingSection,
    createBuildingUnit, createBuildingUnitType, createBuildingSection,
    deleteBuildingUnit, deleteBuildingUnitType, deleteBuildingSection,
} from './slice';
import { FiPlus } from 'react-icons/fi';
import { useHistory, useRouteMatch } from 'react-router-dom';

const exception = [
    'created_on', 'modified_on', 'deleted',
    'Tasks', 'lat', 'long', 'logo'
];

const tabs = [
    'Unit', 'Unit Type', 'Section'
]

const columnsUnit = [
    { Header: "Section", accessor: "section_name" },
    { Header: "Unit Type", accessor: row => row.unit_type_name + " - " + row.unit_size },
    { Header: "Floor", accessor: "Floor" },
    { Header: "Number", accessor: "Number" },
]

const columnsUnitType = [
    { Header: "Name", accessor: "unit_type" },
    { Header: "Size", accessor: "unit_size" },
]

const columnsSection = [
    { Header: "Type", accessor: "section_type" },
    { Header: "Name", accessor: "section_name" },
]

function Component() {
    const [selectedRow, setRow] = useState({});
    const [tab, setTab] = useState(0);

    const [confirm, setConfirm] = useState(false);
    const [addUnit, setAddUnit] = useState(false);
    const [addUnitType, setAddUnitType] = useState(false);
    const [addSection, setAddSection] = useState(false);

    const [sectionID, setSectionID] = useState('');
    const [unitTypeID, setUnitTypeID] = useState('');
    const [floor, setFloor] = useState('');
    const [number, setNumber] = useState('');

    const [typeName, setTypeName] = useState('');
    const [typeSize, setTypeSize] = useState('');

    const [sectionType, setSectionType] = useState('');
    const [sectionName, setSectionName] = useState('');

    const headers = useSelector(state => state.auth.headers);
    const { selected, unit, unit_type, section, loading, refreshToggle } = useSelector(state => state.building);

    let dispatch = useDispatch();
    let history = useHistory();
    let { path, url } = useRouteMatch();

    const fetchData = useCallback((pageIndex, pageSize, search) => {
        tab === 0 && dispatch(getBuildingUnit(headers, pageIndex, pageSize, search, selected));
        tab === 1 && dispatch(getBuildingUnitType(headers, pageIndex, pageSize, search, selected));
        tab === 2 && dispatch(getBuildingSection(headers, pageIndex, pageSize, search, selected));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, refreshToggle, headers, tab])

    useEffect(() => {
        dispatch(getBuildingUnitType(headers, 0, 10, '', selected));
        dispatch(getBuildingSection(headers, 0, 10, '', selected));
    }, [dispatch, headers, selected])

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
                Add Unit
                <Input label="Section" type="select"
                    inputValue={sectionID}
                    setInputValue={setSectionID}
                    options={section.items.map(el => ({
                        label: el.section_name,
                        value: el.id
                    }))}
                />
                <Input label="Unit Type" type="select"
                    inputValue={unitTypeID}
                    setInputValue={setUnitTypeID}
                    options={unit_type.items.map(el => ({
                        label: el.unit_type + ' - ' + el.unit_size,
                        value: el.id
                    }))}
                />
                <Input label="Floor" inputValue={floor} setInputValue={setFloor} />
                <Input label="Number" inputValue={number} setInputValue={setNumber} />
                <div style={{
                    display: 'flex',
                    marginTop: 16,
                }}>
                    <Button label="Cancel" secondary
                        onClick={() => setAddUnit(false)}
                    />
                    <Button label="Add"
                        onClick={() => {
                            dispatch(createBuildingUnit(headers, {
                                "building_id": selected.id,
                                "building_section": parseFloat(sectionID),
                                "unit_type": parseFloat(unitTypeID),
                                "floor": parseFloat(floor),
                                "number": number,
                            }))
                            setAddUnit(false);
                        }}
                    />
                </div>
            </Modal>
            <Modal isOpen={addUnitType} onRequestClose={() => setAddUnitType(false)}>
                Add Unit Type
                <Input label="Type Name" inputValue={typeName} setInputValue={setTypeName}
                    type="select" options={[
                        { label: 'Studio', value: 'studio' },
                        { label: '1BR', value: '1BR' },
                        { label: '2BR', value: '2BR' },
                        { label: '3BR', value: '3BR' },
                        { label: '4BR', value: '4BR' },
                        { label: '5BR', value: '5BR' },
                    ]}
                />
                <Input label="Type Size" inputValue={typeSize} setInputValue={setTypeSize} />
                <div style={{
                    display: 'flex',
                    marginTop: 16,
                }}>
                    <Button label="Cancel" secondary
                        onClick={() => setAddUnitType(false)}
                    />
                    <Button label="Add"
                        onClick={() => {
                            dispatch(createBuildingUnitType(headers, {
                                "building_id": selected.id,
                                "unit_type": typeName,
                                "unit_size": parseFloat(typeSize),
                            }))
                            setAddUnitType(false);
                        }}
                    />
                </div>
            </Modal>
            <Modal isOpen={addSection} onRequestClose={() => setAddSection(false)}>
                Add Section
                <Input label="Section Type" inputValue={sectionType} setInputValue={setSectionType}
                    type="select" options={[
                        { label: 'Tower', value: 'tower' },
                        { label: 'Wing', value: 'wing' },
                    ]}
                />
                <Input label="Section Name" inputValue={sectionName} setInputValue={setSectionName} />
                <div style={{
                    display: 'flex',
                    marginTop: 16,
                }}>
                    <Button label="Cancel" secondary
                        onClick={() => setAddSection(false)}
                    />
                    <Button label="Add"
                        onClick={() => {
                            dispatch(createBuildingSection(headers, {
                                "building_id": selected.id,
                                "section_type": sectionType,
                                "section_name": sectionName,
                            }))
                            setAddSection(false);
                        }}
                    />
                </div>
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
                                    value={selected[el]}
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
                <div className="Container" style={{
                    flex: 2
                }}>

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
                />}
                {tab === 1 && <Table
                    columns={columnsUnitType}
                    data={unit_type.items}
                    loading={loading}
                    pageCount={unit_type.total_pages}
                    fetchData={fetchData}
                    filters={[]}
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
                />}
                {tab === 2 && <Table
                    columns={columnsSection}
                    data={section.items}
                    loading={loading}
                    pageCount={section.total_pages}
                    fetchData={fetchData}
                    filters={[]}
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
                />}
            </div>
        </div>
    )
}

export default Component;