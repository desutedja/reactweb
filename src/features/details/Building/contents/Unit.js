import React, { useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FiPlus } from 'react-icons/fi';

import Table from '../../../../components/Table';
import Button from '../../../../components/Button';
import Modal from '../../../../components/Modal';
import Input from '../../../../components/Input';
import { toSentenceCase } from '../../../../utils';
import { deleteBuildingUnit, getBuildingUnit, editBuildingUnit, createBuildingUnit } from '../../../slices/building';

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

function Component() {
    const [selectedRow, setRow] = useState({});
    const [edit, setEdit] = useState(false);
    const [addUnit, setAddUnit] = useState(false);

    const [sectionID, setSectionID] = useState('');
    const [unitTypeID, setUnitTypeID] = useState('');
    const [floor, setFloor] = useState('');
    const [number, setNumber] = useState('');

    
    const { selected, loading, unit, section, unit_type, refreshToggle } = useSelector(state => state.building);

    let dispatch = useDispatch();

    return (
        <>
            <Modal disableFooter={false} okLabel={edit ? "Save" : "Add"} title={edit ? "Edit Unit" : "Add Unit"}
                isOpen={addUnit} toggle={() => setAddUnit(false)}
                onClick={() => {
                    edit ?
                        dispatch(editBuildingUnit( {
                            "building_id": selected.id,
                            "building_section": parseFloat(sectionID ? sectionID : selectedRow.building_section),
                            "unit_type": parseFloat(unitTypeID ? unitTypeID : selectedRow.unit_type),
                            "floor": parseFloat(floor ? floor : selectedRow.floor),
                            "number": number ? number : selectedRow.number,
                        }, selectedRow.id))
                        :
                        dispatch(createBuildingUnit( {
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
            <Table
                noContainer={true}
                columns={columnsUnit}
                data={unit.items}
                loading={loading}
                pageCount={unit.total_pages}
                totalItems={unit.total_items}
                fetchData={useCallback((pageIndex, pageSize, search) =>
                    dispatch(getBuildingUnit( pageIndex, pageSize, search, selected)),
                    // eslint-disable-next-line react-hooks/exhaustive-deps
                    [dispatch,  selected, refreshToggle])}
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
                    dispatch(deleteBuildingUnit(row, ))
                    // setConfirm(true);
                }}
                onClickEdit={row => {
                    setRow(row);
                    setEdit(true);
                    setAddUnit(true);
                }}
            />
        </>
    )
}

export default Component;
