import React, { useCallback, useState, useEffect } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import { CustomInput } from 'reactstrap';

import Table from '../../../../components/Table';
import Button from '../../../../components/Button';
import Modal from '../../../../components/Modal';
import Input from '../../../../components/Input';
import Filter from '../../../../components/Filter';
import Form from '../../../../components/Form';
import { editBuildingManagement, createBuildingManagement, getBuildingManagement, deleteBuildingManagement } from '../../../slices/building';
import { banks, endpointAdmin } from '../../../../settings';
import { toMoney } from '../../../../utils';
import { get } from '../../../slice';

const columnsManagement = [
    { Header: "ID", accessor: "id" },
    { Header: "Management Name", accessor: "management_name" },
    { Header: "Billing Duedate", accessor: row => "Day " + row.billing_duedate },
    { Header: "Billing Published", accessor: row => "Day " + row.billing_published },
    { Header: "Courier Fee", accessor: row => toMoney(row.courier_fee) },
    { Header: "Internal Courier Markup", accessor: row => toMoney(row.courier_internal_markup) },
    { Header: "External Courier Markup", accessor: row => toMoney(row.courier_external_markup) },
    { Header: "Penalty Fee", accessor: row => toMoney(row.penalty_fee) },
    {
        Header: "Status",
        accessor: row => <CustomInput type="switch" label={row.status} id={"managementStatus-" + row.id}
            checked={row.status === "active"} />
    },
]

function Component() {
    const [selectedRow, setRow] = useState({});
    const [edit, setEdit] = useState(false);
    
    const [addManagement, setAddManagement] = useState(false);

    const [search, setSearch] = useState('');
    const [managementID, setManagementID] = useState('');
    const [managementName, setManagementName] = useState('');
    const [modalManagement, setModalManagement] = useState(false);
    const [managements, setManagements] = useState([]);

    
    const { selected, management, loading, refreshToggle } = useSelector(state => state.building);

    let dispatch = useDispatch();

    useEffect(() => {
        (!search || search >= 3) && get(endpointAdmin + '/management' +
            '?limit=5&page=1' +
            '&search=' + search,  res => {
                let data = res.data.data.items;

                let formatted = data.map(el => ({ label: el.name, value: el.id }));

                setManagements(formatted);
            })
    }, [ search]);

    return (
        <>
            <Modal isOpen={addManagement} toggle={() => setAddManagement(false)} title={edit ? "Edit Management" : "Add Management"}
                okLabel={edit ? "Save" : "Add"} >
                <Form isModal={true} onSubmit={data => {
                    edit ?
                        dispatch(editBuildingManagement( {
                            "building_id": selected.id, building_name: selected.name, ...data,
                        }, selectedRow.id))
                        :
                        dispatch(createBuildingManagement( {
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
            <Table
                columns={columnsManagement}
                data={management.items}
                loading={loading}
                pageCount={management.total_pages}
                totalItems={management.total_items}
                fetchData={useCallback((pageIndex, pageSize, search) => {
                    dispatch(getBuildingManagement( pageIndex, pageSize, search, selected));
                    // eslint-disable-next-line react-hooks/exhaustive-deps
                }, [dispatch, refreshToggle, ])}
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
                    dispatch(deleteBuildingManagement(row, ))
                    // setConfirm(true);
                }}
                onClickEdit={row => {
                    setRow(row);
                    setEdit(true);
                    setAddManagement(true);
                }}
            />
        </>
    )
}

export default Component;
