import React, { useCallback, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import { toSentenceCase } from '../../../../utils';

import Table from '../../../../components/Table';
import Button from '../../../../components/Button';
import Modal from '../../../../components/Modal';
import Input from '../../../../components/Input';
import Filter from '../../../../components/Filter';

import {
    getBuildingSection,createBuildingSection, 
    deleteBuildingSection, editBuildingSection,
} from '../../../slices/building';

const sectionTypes = [
    { label: 'Tower', value: 'tower' },
    { label: 'Wing', value: 'wing' },
]

const columnsSection = [
    { Header: "ID", accessor: "id" },
    { Header: "Name", accessor: row => toSentenceCase(row.section_name) },
    { Header: "Type", accessor: row => toSentenceCase(row.section_type) },
]

function Component() {
    const [selectedRow, setRow] = useState({});
    const [edit, setEdit] = useState(false);

    const [addSection, setAddSection] = useState(false);
    const [sTypeFilter, setSTypeFilter] = useState({});

    const [sectionType, setSectionType] = useState('');
    const [sectionName, setSectionName] = useState('');

    
    const { selected, section, loading, refreshToggle } = useSelector(state => state.building);

    let dispatch = useDispatch();

    return (
        <>
            <Modal isOpen={addSection} toggle={() => setAddSection(false)} title={edit ? "Edit Section" : "Add Section"}
                okLabel={edit ? "Save" : "Add"}
                onClick={() => {
                    edit ?
                        dispatch(editBuildingSection( {
                            "building_id": selected.id,
                            "section_type": sectionType ? sectionType : selectedRow.section_type,
                            "section_name": sectionName ? sectionName : selectedRow.section_name,
                        }, selectedRow.id))
                        :
                        dispatch(createBuildingSection( {
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
                        inputValue={selectedRow.section_name ? toSentenceCase(selectedRow.section_name) : sectionName}
                        setInputValue={setSectionName} />
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
            <Table
                noContainer={true}
                columns={columnsSection}
                data={section.items}
                loading={loading}
                pageCount={section.total_pages}
                totalItems={section.items.length}
                fetchData={useCallback((pageIndex, pageSize, search) => {
                    dispatch(getBuildingSection( pageIndex, pageSize, search, selected, sTypeFilter.value));
                    // eslint-disable-next-line react-hooks/exhaustive-deps
                }, [dispatch, refreshToggle, sTypeFilter, selected])}
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
                    dispatch(deleteBuildingSection(row, ))
                    // setConfirm(true);
                }}
                onClickEdit={row => {
                    setRow(row);
                    setEdit(true);
                    setAddSection(true);
                }}
            />
        </>
    )
}

export default Component;
