import React, { useEffect, useCallback, useState } from 'react';
import { FiSearch, FiPlus } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';

import Button from '../../../../components/Button';
import Table from '../../../../components/Table';
import Modal from '../../../../components/Modal';
import Input from '../../../../components/Input';
import Filter from '../../../../components/Filter';
import { toSentenceCase } from '../../../../utils';
import SectionSeparator from '../../../../components/SectionSeparator';

import {
    getResidentUnit,
    addResidentUnit,
} from '../../../resident/slice';
import { endpointAdmin } from '../../../../settings';
import { get } from '../../../slice';

const columnsUnit = [
    //{ Header: "ID", accessor: "unit_id" },
    { Header: "Building", accessor: "building_name" },
    { Header: "Unit Number", accessor: "number" },
    { Header: "Level", accessor: "level" },
    { Header: "Status", accessor: "status" },
    { Header: "Type", accessor: row => row.unit_type + " - " + row.unit_size },
]


function Component() {
    const [addUnit, setAddUnit] = useState(false);
    const [addUnitStep, setAddUnitStep] = useState(1);

    const [search, setSearch] = useState('');

    const [selectedBuilding, setSelectedBuilding] = useState({});
    const [buildings, setBuildings] = useState([]);

    const [selectedUnit, setSelectedUnit] = useState({});
    const [units, setUnits] = useState([]);

    const [level, setLevel] = useState('main');
    const [status, setStatus] = useState('own');

    const { selected, unit, loading, refreshToggle } = useSelector(state => state.resident);

    let dispatch = useDispatch();
    

    const fetchData = useCallback((pageIndex, pageSize, search) => {
        dispatch(getResidentUnit( pageIndex, pageSize, search, selected));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, refreshToggle, ])

    useEffect(() => {
        addUnit && addUnitStep === 1 && (!search || search.length >= 3) && get(endpointAdmin + '/building' +
            '?page=1' +
            '&limit=10' +
            '&search=' + search,
            
            res => {
                setBuildings(res.data.data.items);
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addUnit, addUnitStep, search, ]);

    useEffect(() => {
        addUnit && addUnitStep === 2 && (!search || search.length >= 3) && get(endpointAdmin + '/building/unit' +
            '?page=1' +
            '&building_id=' + selectedBuilding.value.id +
            '&search=' + search +
            '&limit=10',
            
            res => {
                setUnits(res.data.data.items);
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ addUnit, search, addUnitStep, selectedBuilding]);

    const backFunction = useCallback(() => setAddUnitStep(addUnitStep - 1), [addUnitStep]);

    const submitFunction = (e) => {
        dispatch(addResidentUnit( {
            unit_id: selectedUnit.value.id,
            owner_id: selected.id,
            level: level,
            status: status
        }))
        setAddUnit(false);
        setAddUnitStep(1);
    }

    return (
        <>
            <Modal isOpen={addUnit} title={"Add Unit"}
                disableFooter={addUnitStep === 1}
                okLabel={addUnitStep !== 3 ? "Back" : "Add Unit"}
                cancelLabel={"Back"}
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
                    <Input type="button" inputValue={selectedBuilding.label} onClick={() => { }} />
                    <SectionSeparator />
                    <Input label="Search Unit Number"
                        compact
                        icon={<FiSearch />}
                        inputValue={search} setInputValue={setSearch}
                    />
                    <Filter
                        data={units.map((el) => {
                            return {
                                label: "Room " + el.number + " - " + toSentenceCase(el.section_type) + " " + el.section_name,
                                value: el
                            };
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
                        <SectionSeparator />
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
            <Table
                columns={columnsUnit}
                data={unit.items}
                loading={loading}
                pageCount={unit.total_pages}
                fetchData={fetchData}
                filters={[]}
                actions={[
                    <Button key="Add Unit" label="Add Unit" icon={<FiPlus />}
                        onClick={() => setAddUnit(true)}
                    />
                ]}
            />
        </>
    )
}

export default Component;
