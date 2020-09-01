import React, { useCallback, useState, useEffect } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import { toSentenceCase } from '../../../../utils';

import Table from '../../../../components/Table';
import Button from '../../../../components/Button';
import Modal from '../../../../components/Modal';
import Input from '../../../../components/Input';
import Filter from '../../../../components/Filter';
import { getBuildingUnitType, getBuildingSection, editBuildingUnitType, 
    createBuildingUnitType, deleteBuildingUnitType } from '../../../slices/building';
import { setConfirmDelete } from '../../../slice';

const unitTypes = [
    { label: 'Studio', value: 'studio' },
    { label: 'Penthouse', value: 'penthouse' },
    { label: '1BR', value: '1BR' },
    { label: '2BR', value: '2BR' },
    { label: '3BR', value: '3BR' },
    { label: '4BR', value: '4BR' },
    { label: '5BR', value: '5BR' },
]

const columnsUnitType = [
    { Header: "ID", accessor: "id" },
    {
        Header: "Type", accessor: row => row.unit_type.length > 3 ? toSentenceCase(row.unit_type)
            : row.unit_type.toUpperCase()
    },
    {
        Header: "Size", accessor: row => <div>
            {row.unit_size + ' m'}<sup>2</sup>
        </div>
    },
    {
        Header: "Trivial Name", accessor: row => row.trivial ? toSentenceCase(row.trivial) : '-'
    },
]

function Component({ view }) {
    const [selectedRow, setRow] = useState({});
    const [edit, setEdit] = useState(false);
    const [addUnitType, setAddUnitType] = useState(false);

    const [typeName, setTypeName] = useState('');
    const [typeSize, setTypeSize] = useState('');
    const [typeTrivial, setTypeTrivial] = useState('');

    const [utNameFilter, setUtNameFilter] = useState({});

    const { selected, unit_type, loading, refreshToggle } = useSelector(state => state.building);

    let dispatch = useDispatch();

    useEffect(() => {
        dispatch(getBuildingUnitType( 0, 10, '', selected));
        dispatch(getBuildingSection( 0, 10, '', selected));
    }, [dispatch,  selected]);

    return (
        <>
            <Modal isOpen={addUnitType} toggle={() => setAddUnitType(false)} title={edit ? "Edit Unit Type" : "Add Unit Type"}
                okLabel={edit ? "Save" : "Add"}
                onClick={() => {
                    edit ?
                        dispatch(editBuildingUnitType( {
                            "building_id": selected.id,
                            "unit_type": typeName ? typeName : selectedRow.unit_type,
                            "unit_size": parseFloat(typeSize ? typeSize : selectedRow.unit_size),
                            "trivial": typeTrivial ? typeTrivial : selectedRow.trivial,
                        }, selectedRow.id))
                        :
                        dispatch(createBuildingUnitType( {
                            "building_id": selected.id,
                            "unit_type": typeName ? typeName : selectedRow.unit_type,
                            "unit_size": parseFloat(typeSize ? typeSize : selectedRow.unit_size),
                            "trivial": typeTrivial ? typeTrivial : selectedRow.trivial,
                        }))
                    setAddUnitType(false);
                    setEdit(false);
                    setRow({});
                    setTypeName('');
                    setTypeSize('');
                    setTypeTrivial('');
                }}
            >
                <form >
                    <Input label="Type"
                        inputValue={selectedRow.unit_type ? selectedRow.unit_type : typeName}
                        setInputValue={setTypeName}
                        type="select" options={unitTypes}
                        disabled={edit}
                    />
                    <Input label="Type Size" addons={<p>m<sup>2</sup></p>}
                        inputValue={selectedRow.unit_size ? selectedRow.unit_size : typeSize}
                        setInputValue={setTypeSize} />
                    <Input label="Type Trivial Name"  placeholder="e.g. Greenwood, Sandalwood"
                        inputValue={selectedRow.trivial ? selectedRow.trivial : typeTrivial}
                        setInputValue={setTypeTrivial} />
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
                columns={columnsUnitType}
                data={unit_type.items}
                loading={loading}
                pageCount={unit_type.total_pages}
                totalItems={unit_type.items.length}
                fetchData={useCallback((pageIndex, pageSize, search) => {
                    dispatch(getBuildingUnitType( pageIndex, pageSize, search, selected, utNameFilter.value));
                    // eslint-disable-next-line react-hooks/exhaustive-deps
                }, [dispatch,  selected, utNameFilter.value, refreshToggle])}
                filters={[
                    {
                        hidex: !utNameFilter.label,
                        label: "Type: ",
                        value: utNameFilter.label ? utNameFilter.label : "All",
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
                actions={view ? null : [
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
                onClickDelete={view ? null : row => {
                    dispatch(setConfirmDelete("Are you sure to delete this item?",
                        () => dispatch(deleteBuildingUnitType(row, ))
                    ))
                }}
                onClickEdit={view ? null : row => {
                    setRow(row);
                    setEdit(true);
                    setAddUnitType(true);
                }}
            />
        </>
    )
}

export default Component;
