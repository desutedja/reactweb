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
import { editBuildingManagement, createBuildingManagement, getBuildingManagement, deleteBuildingManagement, changeBuildingManagement } from '../../../slices/building';
import { endpointAdmin } from '../../../../settings';
import { toMoney } from '../../../../utils';
import { get } from '../../../slice';

const dateArray = (() => {
    const array = Array(31).fill({});

    return array.map((el, index) => ({
        label: index + 1 + '',
        value: index + 1 + '',
    }))
})()

function Component() {
    const { auth } = useSelector(state => state)
    const [selectedRow, setRow] = useState({});
    const [edit, setEdit] = useState(false);
    const [addManagement, setAddManagement] = useState(false);
    const [loadDefault, setLoadDefault] = useState(5);

    const [search, setSearch] = useState('');
    const [managementID, setManagementID] = useState('');
    const [managementName, setManagementName] = useState('');
    const [modalManagement, setModalManagement] = useState(false);
    const [managements, setManagements] = useState([]);

    const [confirmChange, handleConfirm] = useState(false);
    const [managementChose, setManagementChose] = useState({});

    const { banks } = useSelector(state => state.main);
    const { selected, management, loading, refreshToggle } = useSelector(state => state.building);

    let dispatch = useDispatch();

    const columnsManagement = [
        { Header: "ID", accessor: "id" },
        {
            Header: "Management Name", accessor: row =>
                <a class="Link" href={"/" + auth.role + "/management/" + row.management_id}>{row.management_name}</a>
        },
        { Header: "In Range", accessor: row => row.in_range + ' km' },
        { Header: "Billing Published", accessor: row => "Day " + row.billing_published },
        { Header: "Billing Duedate", accessor: row => "Day " + row.billing_duedate },
        { Header: "Billing Penalty Fee", accessor: row => row.penalty_fee + ' %' },
        { Header: "Courier Fee", accessor: row => toMoney(row.courier_fee) },
        { Header: "Internal Courier Markup", accessor: row => row.courier_internal_markup + ' %' },
        { Header: "External Courier Markup", accessor: row => row.courier_external_markup + ' %' },
        {
            Header: "Status",
            accessor: row => {
                return (
                    <CustomInput
                        className="cursor-pointer"
                        type="switch"
                        label={row.status}
                        id={"managementStatus-" + row.id}
                        onClick={e => {
                            const data = {
                                building_id: row.building_id,
                                management_id: row.management_id,
                                status: row.status === 'active' ? 'inactive' : 'active',
                                management_name: row.management_name
                            }
                            handleConfirm(true);
                            setManagementChose(data);
                        }}
                        checked={row.status === "active"}
                    />
                )
            }
        },
    ]

    useEffect(() => {
        (!search || search.length >= 1) && dispatch(get(endpointAdmin + '/management' +
            '?limit=' + loadDefault + '&page=1' +
            '&search=' + search, res => {
                let data = res.data.data.items;
                const totalItems = res.data.data.total_items;
                const currentItems = totalItems - data.length;

                let formatted = data.map(el => ({ label: el.name, value: el.id, clickable: true }));
                if (currentItems > 0 && !search) {
                    formatted.push({
                        label: `Load more (${currentItems})`,
                        className: 'load-more',
                        clickable: false
                    })
                    setManagements(formatted);
                } else setManagements(formatted);
            }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, search, loadDefault]);

    return (
        <>
            <Modal
                disableHeader={true}
                isOpen={confirmChange}
                onClick={() => {
                    delete managementChose.management_name
                    dispatch(changeBuildingManagement(managementChose))
                    handleConfirm(false)
                }}
                onClickSecondary={() => handleConfirm(false)}
                okLabel={"Sure"}
            >
                <h4 className="mb-3" style={{
                    fontSize: '1.2rem'
                }}>Are you sure to set <strong>{managementChose.management_name}</strong> as
                {managementChose.status === 'active' ? ' Active' : ' Inactive'}?</h4>
                {managementChose.status === 'active' && <span style={{
                    color: '#ff1212',
                    fontSize: '.97rem'
                }}>This will make all other management Inactive.</span>}
            </Modal>
            <Modal
                isOpen={addManagement}
                toggle={() => setAddManagement(false)}
                title={edit ? "Edit Management" : "Add Management"}
                disableFooter={true}
                okLabel={edit ? "Save" : "Add"} >
                <Form
                    noContainer={true}
                    showCancel={true}
                    onCancel={() => {
                        setAddManagement(false);
                        setEdit(false);
                    }}
                    onSubmit={data => {
                        console.log(data)
                        edit ?
                            dispatch(editBuildingManagement({
                                "building_id": selected.id, building_name: selected.name, ...data,
                                status: managementChose.status,
                            }, selectedRow.id))
                            :
                            // console.log({
                            //     "building_id": selected.id, building_name: selected.name, ...data})
                            dispatch(createBuildingManagement({
                                "building_id": selected.id, building_name: selected.name, ...data,
                            }))
                        setAddManagement(false);
                        setEdit(false);
                        setRow({});
                    }}>
                    <Modal width="400px" disableFooter={true} isOpen={modalManagement} toggle={() => setModalManagement(false)}>
                        <Input label="Search"
                            inputValue={search} setInputValue={setSearch}
                            placeholder="Type managements..."
                        />
                        <Filter
                            data={managements}
                            onClick={(el) => {
                                if (el.clickable) {
                                    setManagementID(el.value);
                                    setManagementName(el.label);
                                    setModalManagement(false);
                                    return;
                                }
                                setLoadDefault(loadDefault + 5);
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
                    <Input label="Select Management" type="button"
                        inputValue={managementName ? managementName : selectedRow.management_name}
                        onClick={() => setModalManagement(true)}
                        disabled={edit}
                    />
                    <Input label="Status" hidden inputValue="inactive" />
                    <Input label="In Range" type="number" inputValue={selectedRow.in_range} />
                    <Input label="Settlement Bank" type="select" options={banks} inputValue={selectedRow.settlement_bank} />
                    <Input label="Settlement Account No" inputValue={selectedRow.settlement_account_no} />
                    <Input label="Settlement Account Name"
                        inputValue={selectedRow.settlement_account_name} />
                    <Input label="Billing Published (Date)" name="billing_published" type="select"
                        options={dateArray}
                        inputValue={selectedRow.billing_published}
                    />
                    <Input label="Billing Due (Date)" name="billing_duedate" type="select"
                        options={dateArray}
                        inputValue={selectedRow.billing_duedate} />
                    <Input label="Penalty Fee" type="number" addons="%"
                        inputValue={selectedRow.penalty_fee} />
                    <Input label="Courier Fee" type="number" addons="rupiah"
                        inputValue={selectedRow.courier_fee}
                    />
                    <Input label="Courier Internal Markup" type="number" addons="%"
                        inputValue={selectedRow.courier_internal_markup}
                    />
                    <Input label="Courier External Markup" type="number" addons="%"
                        inputValue={selectedRow.courier_external_markup}
                    />
                </Form>
            </Modal>
            <Table
                noContainer={true}
                columns={columnsManagement}
                data={management.items}
                loading={loading}
                pageCount={management.total_pages}
                totalItems={management.items.length}
                fetchData={useCallback((pageIndex, pageSize, search) => {
                    dispatch(getBuildingManagement(pageIndex, pageSize, search, selected));
                    // eslint-disable-next-line react-hooks/exhaustive-deps
                }, [dispatch, refreshToggle])}
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
                    dispatch(deleteBuildingManagement(row,))
                    // setConfirm(true);
                }}
                onClickEdit={row => {
                    setRow(row);
                    setEdit(true);
                    setAddManagement(true);
                    setManagementChose(row);
                }}
            />
        </>
    )
}

export default Component;
