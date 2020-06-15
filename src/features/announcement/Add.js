import React, { useState, useCallback, useEffect } from 'react';

import Input from '../../components/Input';
import Form from '../../components/Form';
import Modal from '../../components/Modal';
import Table from '../../components/Table';
import Button from '../../components/Button';
import Link from '../../components/Link';
import Editor from '../../components/Editor';
import SectionSeparator from '../../components/SectionSeparator';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { FiChevronRight, FiX } from 'react-icons/fi';
import { RiCheckDoubleLine, RiCheckLine } from 'react-icons/ri';
import { get, toSentenceCase } from '../../utils';
import { endpointAdmin } from '../../settings';
import { createAnnouncement, editAnnouncement } from './slice';

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

function Component() {
    const [modalBuilding, setModalBuilding] = useState(false);
    const [modalUnit, setModalUnit] = useState(false);

    const [buildings, setBuildings] = useState([]);
    const [buildingsSelected, setBuildingsSelected] = useState([]);
    const [buildingsPageCount, setBuildingsPageCount] = useState(1);
    const [buildingsLoading, setBuildingsLoading] = useState(false);

    const [units, setUnits] = useState([]);
    const [unitsSelected, setUnitsSelected] = useState([]);
    const [unitsPageCount, setUnitsPageCount] = useState(1);
    const [unitsLoading, setUnitsLoading] = useState(false);

    const headers = useSelector(state => state.auth.headers);
    const { loading, selected } = useSelector(state => state.announcement);

    let dispatch = useDispatch();
    let history = useHistory();

    useEffect(() => {
        console.log(buildingsSelected[0])
    }, [buildingsSelected]);

    useEffect(() => {
        // get(endpointAdmin + '/building' +
        //     '?page=' + 1 +
        //     '&search=' +
        //     '&limit=' + 100,
        //     headers,
        //     res => {
        //         const { items } = res.data.data;

        //         let selectedBuildings = items.filter(el => selected.building.includes(el.id));
        //         setBuildingsSelected(selectedBuildings);
        //     });

        let selectedBuildings = selected.building?.map(el => ({
            id: el.building_id,
            name: el.building_name
        }));
        selected.building && setBuildingsSelected(selectedBuildings);
    }, [headers, selected.building]);

    return (
        <div>
            <Modal isOpen={modalBuilding} onRequestClose={() => setModalBuilding(false)}>
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
                        get(endpointAdmin + '/building' +
                            '?page=' + (pageIndex + 1) +
                            '&search=' + search +
                            '&limit=' + pageSize,
                            headers,
                            res => {
                                const { items, total_pages } = res.data.data;
                                setBuildings(items);
                                setBuildingsPageCount(total_pages);

                                setBuildingsLoading(false);
                            });
                        // eslint-disable-next-line react-hooks/exhaustive-deps
                    }, [headers])}
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
            <Modal isOpen={modalUnit} onRequestClose={() => setModalUnit(false)}>
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
                        get(endpointAdmin + '/building/unit' +
                            '?page=' + (pageIndex + 1) +
                            '&building_id=' + buildingsSelected[0]?.id +
                            '&search=' + search +
                            '&limit=' + pageSize,
                            headers,
                            res => {
                                const { items, total_pages } = res.data.data;
                                setUnits(items);
                                setUnitsPageCount(total_pages);

                                setUnitsLoading(false);
                            });
                        // eslint-disable-next-line react-hooks/exhaustive-deps
                    }, [headers, buildingsSelected])}
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
                            <Button key="Select All" label="Select All" icon={<RiCheckDoubleLine />}
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
            <Form
                onSubmit={data => {
                    selected.id ?
                        dispatch(editAnnouncement(headers, data, history, selected.id))
                        :
                        dispatch(createAnnouncement(headers, data, history));
                }}
                loading={loading}
            >
                <Input label="Title" type="textarea" inputValue={selected.title} />
                <Input label="Building" hidden inputValue={JSON.stringify(buildingsSelected.map(el =>
                    el.id
                ))} />
                <Input label="Select Building"
                    actionlabels={
                        buildingsSelected.length > 0 ? { "Deselect All": () => setBuildingsSelected([]) } : {}
                    }
                    type="multiselect"
                    icon={<FiChevronRight />}
                    onClick={() => setModalBuilding(true)}
                    inputValue={buildingsSelected.map(el => ({
                        value: el.name,
                        onClickDelete: () => {
                            setBuildingsSelected(buildingsSelected.filter(el2 => el2.id !== el.id));
                            setUnitsSelected([]);
                        }
                    }))} />
                <Input label="Building Unit" hidden inputValue={JSON.stringify(unitsSelected.map(el =>
                    ({
                        "building_id": buildingsSelected[0]?.id,
                        "building_unit_id": el.id
                    })
                ))} />
                {buildingsSelected.length === 1 && <Input label="Select Unit"
                    actionlabels={
                        unitsSelected.length > 0 ? { "Deselect All": () => setUnitsSelected([]) } : {}
                    }
                    type="multiselect"
                    icon={<FiChevronRight />}
                    onClick={() => setModalUnit(true)}
                    inputValue={unitsSelected.map(el => ({
                        value: toSentenceCase(el.section_type) + " " + el.section_name + " " + el.number,
                        onClickDelete: () => {
                            setUnitsSelected(unitsSelected.filter(el2 => el2.id !== el.id))
                        }
                    }))} />}
                <Input label="Consumer Role" type="select" options={roles}
                    inputValue={selected.consumer_role}
                />
                <Input label="Image" type="file" inputValue={selected.image} />
                <Editor label="Description" inputValue={selected.description} />
            </Form>
        </div>
    )
}

export default Component;
