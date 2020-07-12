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

import { endpointAdmin, endpointMerchant } from '../../settings';
import { createAnnouncement, editAnnouncement } from '../slices/announcement';
import { endpointResident } from '../../settings';
import { get } from '../slice';

import Template from './components/TemplateWithFormik';
import Input from './input';
import { Form } from 'formik';
import { announcementSchema } from './schemas';

const announcementPayload = {
    title: "",
    target_building: "allbuilding",
    target_merchant: "allmerchant",
    building: [],
    consumer_role: "",
    image: "",
    description: "",
    building_unit: [],
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
    { value: 'management', label: 'Building Management' },
    { value: 'staff', label: 'Staff' },
    { value: 'staff_courier', label: 'Staff Courier' },
    { value: 'staff_security', label: 'Staff Security' },
    { value: 'staff_technician', label: 'Staff Technician' },
    { value: 'resident', label: 'Resident' },
    { value: 'merchant', label: 'Merchant' },
]

const target_buildings = [
    { label: "All Building", value: "allbuilding"},
    { label: "Specific Building(s)", value: "specificbuilding"},
]

const target_merchants = [
    { label: "All Merchant", value: "allmerchant"},
    { label: "Specific Merchant(s)", value: "specificmerchant"},
]

function Component() {
    const { loading, selected } = useSelector(state => state.announcement);

    const [modalBuilding, setModalBuilding] = useState(false);
    const [modalUnit, setModalUnit] = useState(false);

    const [buildings, setBuildings] = useState([]);
    const [selectedBuildings, setSelectedBuildings] = useState(selected.building ? selected.building : []);

    const [units, setUnits] = useState([]);
    const [unitsSelected, setUnitsSelected] = useState([]);
    const [unitsPageCount, setUnitsPageCount] = useState(1);
    const [unitsLoading, setUnitsLoading] = useState(false);

    const [searchbuilding, setSearchbuilding] = useState('');
    const [searchUnit, setSearchUnit] = useState('');
    const [stillLoading, setStillLoading] = useState(false);

    const [searchmerchant, setSearchmerchant] = useState('');
    const [merchants, setMerchants] = useState([]);
    const [selectedMerchants, setSelectedMerchants] = useState([]);

    let dispatch = useDispatch();
    let history = useHistory();

    useEffect(() => {
        searchmerchant.length > 1 && setStillLoading(true); 
        searchmerchant.length > 1 && dispatch(get(endpointMerchant + '/admin/list' +
            '?limit=5&page=1' +
            '&search=' + searchmerchant, res => {
                let data = res.data.data.items;

                let formatted = data.map(el => ({ label: el.name, value: el.id }));

                console.log(formatted);
                setMerchants(formatted);
                setStillLoading(false);
            }));
    }, [dispatch, searchmerchant]);

    useEffect(() => {
        searchbuilding.length > 1 && dispatch(get(endpointAdmin + '/building' +
            '?limit=5&page=1' +
            '&search=' + searchbuilding, res => {
                let data = res.data.data.items;

                let formatted = data.map(el => ({ label: el.name, value: el.id }));

                setBuildings(formatted);
            }));
    }, [dispatch, searchbuilding]);

    useEffect(() => {
        if (selectedBuildings.length === 0) return;

        /* We might have different structure we got from selected or from multiselect input */
        let buildingid = selectedBuildings[0].building_id ? 
            selectedBuildings[0].building_id : selectedBuildings[0].value;

        selectedBuildings.length === 1 && searchUnit.length > 1 && 
            dispatch(get(endpointAdmin + '/building/unit?building_id=' + buildingid + 
            '&limit=5&page=1' +
            '&search=' + searchUnit, res => {
                let data = res.data.data.items;

                let formatted = data.map(el => ({ label: "Room " + el.number + ", Section: " +  el.section_name, value: el.id }));

                setUnits(formatted);
            }));
    }, [dispatch, searchUnit, selectedBuildings]);

    const payload = selected.id ? {
                ...announcementPayload, ...selected,
                /* when it's editing, the format from server isn't the same as we expected, so we need to reformat again */
                target_building: selected.building && selected.building.length > 0 ? 'specificbuilding' : 'allbuilding',
                target_merchant: selected.merchant && selected.merchant.length > 0 ? 'specificmerchant' : 'allmerchant',
                merchant: selected.merchant && selected.merchant.map(el => ({label: el.name, value: el.id})),
                building: selected.building && selected.building.map(el => ({label: el.building_name, value: el.building_id})),
                building_unit: selected.building_unit && selected.building_unit.map(el => 
                    ({label: "Room " + el.number + ", Section: " + el.section_name, value: el.building_unit_id })) }
                : announcementPayload;

    return (
        <>
        <Template
            slice="announcement"
            payload={payload}
            schema={announcementSchema}
            formatValues={values => ({
                ...values,
                building: values.consumer_role === 'centratama' || values.consumer_role === 'merchant' ? [] : 
                    values.building.map( el => el.value ),
                building_unit: (values.consumer_role !== 'resident' || values.building.length !== 1) ? [] : 
                    values.building_unit.map(el => ({ building_id: values.building[0].value, building_unit_id: el.value })),
                merchant: values.consumer_role === 'merchant' ? values.merchant.map(el => el.value) : [],
            })}
            edit={data => {
                //console.log(data);
                dispatch(editAnnouncement(data, history, selected.id))
            }}
            add={data => {
                //console.log(data);
                dispatch(createAnnouncement(data, history))
            }}
            renderChild={props => {
                const { setFieldValue, values } = props;

                return (
                    <Form className="Form">
                        <Input {...props} label="Title" placeholder="Input Announcement Title" name="title"/>
                        <Input {...props} type="select" label="Consumer Role" placeholder="Select Consumer Role" 
                            options={roles} />
                        {values.consumer_role.length > 0 && values.consumer_role !== 'centratama' && values.consumer_role !== 'merchant' &&
                        <Input {...props} label="Target Building" name="target_building" type="radio" options={target_buildings} 
                                defaultValue="allbuilding"
                                onChange={ el => setFieldValue(el.value) }/>}
                        {values.consumer_role.length > 0 && values.consumer_role === 'merchant' && 
                            <Input {...props} label="Target Merchant" name="target_merchant" type="radio" options={target_merchants} 
                                onChange={ el => setFieldValue(el.value) }/>}
                        {values.target_building === "specificbuilding" && values.consumer_role !== 'merchant' 
                                && values.consumer_role !== 'centratama' &&
                            <Input {...props} type="multiselect" 
                                label="Select Building(s)" name="building"
                                defaultValue={values.building}
                                placeholder="Start typing building name to add" options={buildings} 
                                onInputChange={ (e, value) => value === '' ? setBuildings([]) : setSearchbuilding(value) }
                                onChange={ (e, value) => {
                                    // if there's change in selected buildings, clear units
                                    if (value !== selectedBuildings) {
                                        setFieldValue("building_unit", []);
                                    }
                                    setSelectedBuildings(value)
                                }}
                            /> }
                        {values.target_merchant === "specificmerchant" && values.consumer_role === 'merchant' &&
                            <Input {...props} type="multiselect" 
                                label="Select Building(s)" name="merchant"
                                defaultValue={values.merchant}
                                placeholder="Start typing merchant name to add" options={merchants} 
                                onInputChange={ (e, value) => value === '' ? setMerchants([]) : setSearchmerchant(value) }
                                onChange={ (e, value) => setSelectedMerchants(value) }
                            /> }
                        {values.consumer_role === 'resident' && values.building.length === 1 && values.target_building === "specificbuilding" && 
                            <Input {...props} type="multiselect" label="Select Unit(s)" name="building_unit"
                                onInputChange={ (e, value) => value === '' ? setUnits([]) : setSearchUnit(value) } 
                                defaultValue={values.building_unit}
                                hint={"Selecting unit is only valid when consumer is resident and when selecting only 1 building.  " + 
                                     "Not specifying unit means targeting the announcement for all resident."}
                                placeholder="Start typing room number to add" 
                                options={units}
                            />}
                        <Input {...props} type="file" label="Image (optional)" name="image" placeholder="Image URL"/> 
                        <Input {...props} type="textarea" label="Description" placeholder="Insert Announcement Description"/> 
                        <button type="submit">Submit</button>
                    </Form>
                )
            }
            }
        /></>
    )
}

export default Component;
