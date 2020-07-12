import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import SectionSeparator from '../../components/SectionSeparator';
import Modal from '../../components/Modal';
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

function Component() {
    const { loading, selected } = useSelector(state => state.building);

    const [modalBuilding, setModalBuilding] = useState(false);
    const [modalUnit, setModalUnit] = useState(false);

    const [type, setType] = useState('');

    const [buildings, setBuildings] = useState([]);
    const [buildingsSelected, setBuildingsSelected] = useState([]);
    const [buildingsPageCount, setBuildingsPageCount] = useState(1);
    const [buildingsLoading, setBuildingsLoading] = useState(false);

    const [units, setUnits] = useState([]);
    const [unitsSelected, setUnitsSelected] = useState([]);
    const [unitsPageCount, setUnitsPageCount] = useState(1);
    const [unitsLoading, setUnitsLoading] = useState(false);

    let dispatch = useDispatch();
    let history = useHistory();

    useEffect(() => {
        console.log(buildingsSelected[0])
    }, [buildingsSelected]);

    useEffect(() => {
        let selectedBuildings = selected.building?.map(el => ({
            id: el.building_id,
            name: el.building_name
        }));
        selected.building && setBuildingsSelected(selectedBuildings);
    }, [ selected.building]);

    return (
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
                        <Modal isOpen={modalBuilding} toggle={() => setModalBuilding(false)}>
                            <p className="Title" style={{
                                marginBottom: 16
                            }}>Select Building</p>
                            <Table
                                columns={columnsBuilding}
                                data={buildings}
                                loading={buildingsLoading}
                                pageCount={buildingsPageCount}
                                fetchData={useCallback((pageIndex, pageSize, search) => {
                                    setBuildingsLoading(true);
                                    dispatch(get(endpointAdmin + '/building' +
                                        '?page=' + (pageIndex + 1) +
                                        '&search=' + search +
                                        '&limit=' + pageSize,
                                        
                                        res => {
                                            const { items, total_pages } = res.data.data;
                                            setBuildings(items);
                                            setBuildingsPageCount(total_pages);

                                            setBuildingsLoading(false);
                                        }));
                                    // eslint-disable-next-line react-hooks/exhaustive-deps
                                }, [])}
                                renderActions={(selectedRowIds, page) => {
                                    // console.log(selectedRowIds, page);
                                    return ([
                                        <Button
                                            disabled={Object.keys(selectedRowIds).length === 0}
                                            key="Select"
                                            label="Select"
                                            icon={<RiCheckLine />}
                                            onClick={() => {
                                                let selectedBuildings =
                                                    page.filter(el => Object.keys(selectedRowIds).includes(el.id))
                                                        .map(el => el.original);

                                                console.log(selectedBuildings);
                                                setBuildingsSelected(selectedBuildings);
                                                setModalBuilding(false);
                                            }}
                                        />,
                                    ])
                                }}
                            />
                        </Modal>
                        <Modal isOpen={modalUnit} toggle={() => setModalUnit(false)}>
                            <p className="Title" style={{
                                marginBottom: 16
                            }}>Select Unit</p>
                            <Table
                                columns={columnsUnit}
                                data={units}
                                loading={unitsLoading}
                                pageCount={unitsPageCount}
                                fetchData={useCallback((pageIndex, pageSize, search) => {
                                    setUnitsLoading(true);
                                    dispatch(get(endpointAdmin + '/building/unit' +
                                        '?page=' + (pageIndex + 1) +
                                        '&building_id=' + buildingsSelected[0]?.id +
                                        '&search=' + search +
                                        '&limit=' + pageSize,
                                        
                                        res => {
                                            const { items, total_pages } = res.data.data;
                                            setUnits(items);
                                            setUnitsPageCount(total_pages);

                                            setUnitsLoading(false);
                                        }));
                                    // eslint-disable-next-line react-hooks/exhaustive-deps
                                }, [ buildingsSelected])}
                                renderActions={(selectedRowIds, page) => {
                                    return ([
                                        <Button
                                            disabled={Object.keys(selectedRowIds).length === 0}
                                            key="Select"
                                            label="Select"
                                            icon={<RiCheckLine />}
                                            onClick={() => {
                                                let selectedUnits =
                                                    page.filter(el => Object.keys(selectedRowIds).includes(el.id))
                                                        .map(el => el.original);

                                                console.log(selectedUnits);
                                                setUnitsSelected(selectedUnits);
                                                setModalUnit(false);
                                            }}
                                        />,
                                        <Button key="All: All" label="All: All" icon={<RiCheckDoubleLine />}
                                            onClick={() => {
                                                let selectedUnits =
                                                    page.map(el => el.original);

                                                console.log(selectedUnits);
                                                setUnitsSelected(selectedUnits);
                                                setModalUnit(false);
                                            }}
                                        />,
                                    ])
                                }}
                            />
                        </Modal>
                        <Input {...props} label="Title" placeholder="Input Announcement Title" />
                        <button onClick={() => setModal(true)}>Select Location</button>
                    </Form>
                )
            }
            }
        />
    )
}

export default Component;
