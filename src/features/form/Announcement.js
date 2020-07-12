import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';

import Table from '../../components/Table';
import Button from '../../components/Button';
import Link from '../../components/Link';
import Editor from '../../components/Editor';
import SectionSeparator from '../../components/SectionSeparator';
import Modal from '../../components/Modal';
import { toSentenceCase } from '../../utils';

import { endpointAdmin } from '../../settings';
import { createAnnouncement, editAnnouncement } from '../slices/announcement';
import { endpointResident } from '../../settings';
import { get } from '../slice';

import Template from './components/TemplateWithFormik';
import Input from './input';
import { Form } from 'formik';
import { announcementSchema } from './schemas';

const announcementPayload = {
    title: "",
    building: "",
    consumer_role: "",
    image: "",
    description: "",
}

const columnsBuilding = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Name', accessor: 'name' },
    { Header: 'Legal Name', accessor: 'legal_name' },
    { Header: 'Code Name', accessor: 'code_name' },
    { Header: 'Owner', accessor: 'owner_name' },
    { Header: 'Website', accessor: row => <Link>{row.website}</Link> },
]

const columnsUnit = [
    { Header: "ID", accessor: "id" },
    { Header: "Number", accessor: "number" },
    { Header: "Floor", accessor: "floor" },
    { Header: "Section", accessor: row => toSentenceCase(row.section_type) + " " + row.section_name },
    { Header: "Type", accessor: row => row.unit_type_name + " - " + row.unit_size },
]

const roles = [
    { value: 'centratama', label: 'Centratama' },
    { value: 'management', label: 'Management' },
    { value: 'staff', label: 'Staff' },
    { value: 'staff_courier', label: 'Staff Courier' },
    { value: 'staff_security', label: 'Staff Security' },
    { value: 'staff_technician', label: 'Staff Technician' },
    { value: 'resident', label: 'Resident' },
    { value: 'merchant', label: 'Merchant' },
]

const types = [
    { label: "All Building", value: "allbuilding"},
    { label: "Specific Building(s)", value: "specificbuilding"},
]

function Component() {
    const { loading, selected } = useSelector(state => state.building);

    const [modalBuilding, setModalBuilding] = useState(false);
    const [modalUnit, setModalUnit] = useState(false);

    const [buildings, setBuildings] = useState([]);
    const [selectedBuildings, setSelectedBuildings] = useState([]);

    const [units, setUnits] = useState([]);
    const [unitsSelected, setUnitsSelected] = useState([]);
    const [unitsPageCount, setUnitsPageCount] = useState(1);
    const [unitsLoading, setUnitsLoading] = useState(false);

    const [searchbuilding, setSearchbuilding] = useState('');
    const [searchUnit, setSearchUnit] = useState('');
    const [stillLoading, setStillLoading] = useState(false);

    let dispatch = useDispatch();
    let history = useHistory();

    useEffect(() => {
        searchbuilding.length > 3 && setStillLoading(true); 
        searchbuilding.length > 3 && dispatch(get(endpointAdmin + '/building' +
            '?limit=5&page=1' +
            '&search=' + searchbuilding, res => {
                let data = res.data.data.items;

                let formatted = data.map(el => ({ label: el.name, value: el.id }));

                setBuildings(formatted);
                setStillLoading(false);
            }));
    }, [dispatch, searchbuilding]);

    useEffect(() => {
        selectedBuildings.length === 1 && searchUnit.length > 2 && setStillLoading(true); 
        selectedBuildings.length === 1 && searchUnit.length > 2 && 
            dispatch(get(endpointAdmin + '/building/unit?building_id=' + selectedBuildings[0].value +
            '&limit=5&page=1' +
            '&search=' + searchUnit, res => {
                let data = res.data.data.items;

                let formatted = data.map(el => ({ label: "Room " + el.number + ", Section: " +  el.section_name, value: el.id }));

                setUnits(formatted);
                setStillLoading(false);
            }));
    }, [dispatch, searchUnit, selectedBuildings]);

    return (
        <>
        <Template
            slice="announcement"
            payload={selected.id ? {
                ...announcementPayload, ...selected,
            } : announcementPayload}
            schema={announcementSchema}
            formatValues={values => ({
                ...values,
            })}
            edit={data => dispatch(editAnnouncement(data, history, selected.id))}
            add={data => dispatch(createAnnouncement(data, history))}
            renderChild={props => {
                const { setFieldValue, values } = props;

                return (
                    <Form className="Form">
                        <Input {...props} label="Title" placeholder="Input Announcement Title" name="title"/>
                        <Input {...props} type="select" label="Consumer Role" placeholder="Select Consumer Role" 
                            name="consumer_role" options={roles} />
                        {values.consumer_role !== 'centratama' && 
                            <Input {...props} label="Target" type="radio" options={types} 
                                onChange={ el => setFieldValue(el.value) }/>}
                        {values.consumer_role !== 'centratama' && values.target === "specificbuilding" && 
                            <Input {...props} type="multiselect" 
                                label="Select Building(s)" name="building"
                                placeholder="Start typing building name to add" options={buildings} loading={stillLoading}
                                onInputChange={ (e, value) => setSearchbuilding(value) }
                                onChange={ (e, value) => { setSelectedBuildings(value); console.log(value);} }
                            /> }
                        {values.consumer_role === 'resident' && values.building.length === 1 && 
                            <Input {...props} type="multiselect" label="Select Unit(s)" name="unit"
                                onInputChange={ (e, value) => setSearchUnit(value) } 
                                placeholder="Start typing room number to add" 
                                hint="Selecting unit is only valid when selecting only one building"
                                options={units}
                            />}
                        <Input {...props} type="file" label="Optional Image" name="image" placeholder=""/> 
                        <Input {...props} type="textarea" label="Description" placeholder="Insert content of announcement"/> 
                    </Form>
                )
            }
            }
        /></>
    )
}

export default Component;
