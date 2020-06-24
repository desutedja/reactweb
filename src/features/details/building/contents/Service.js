import React, { useCallback, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import { toMoney } from '../../../../utils';

import Table from '../../../../components/Table';
import Button from '../../../../components/Button';
import Modal from '../../../../components/Modal';
import Input from '../../../../components/Input';
import Filter from '../../../../components/Filter';
import { editBuildingService, createBuildingService, getBuildingService, 
    deleteBuildingService } from '../../../building/slice';

const serviceGroup = [
    { label: 'IPL', value: 'ipl' },
    { label: 'Non-IPL', value: 'nonipl' },
]

const columnsService = [
    { Header: "ID", accessor: "id" },
    { Header: "Name", accessor: "name" },
    { Header: "Group", accessor: row => row.group === 'ipl' ? 'IPL' : 'Non-IPL' },
    { Header: "Description", accessor: row => row.description ? row.description : '-' },
    {
        Header: "Price", accessor: (row) => {
            return (row.price_fixed > 0 ? toMoney(row.price_fixed) + " (Fixed)" : toMoney(row.price_unit) + " / " + row.denom_unit)
        },

    },
    {
        Header: "Tax", accessor: row => (row.tax === "percentage" ?
            row.tax_value + "%" : toMoney(row.tax_amount) + " (Fixed)")
    },
]

function Component() {
    const [selectedRow, setRow] = useState({});
    const [edit, setEdit] = useState(false);

    const [addService, setAddService] = useState(false);

    const [priceType, setPriceType] = useState('fixed');
    const [taxType, setTaxType] = useState('percentage');

    const [sGroupFilter, setSGroupFilter] = useState({});

    
    const { selected, service, loading, refreshToggle } = useSelector(state => state.building);

    let dispatch = useDispatch();

    return (
        <>
            <Modal isOpen={addService} toggle={() => setAddService(false)} title={edit ? "Edit Service" : "Add Service"}
                okLabel={edit ? "Save" : "Add"}
                onClick={data => {
                    edit ?
                        dispatch(editBuildingService( {
                            "building_id": selected.id, building_name: selected.name, ...data,
                        }, selectedRow.id))
                        : dispatch(createBuildingService( { ...data, building_id: selected.id }));

                    setAddService(false);
                    setEdit(false);
                    setRow({});
                }}
            >
                <form >
                    <Input label="Name" inputValue={selectedRow.name} />
                    <Input label="Group" type="select" inputValue={selectedRow.group} options={[
                        { value: 'ipl', label: 'IPL' },
                        { value: 'nonipl', label: 'Non-IPL' },
                    ]} />
                    <Input label="Description" inputValue={selectedRow.description} />
                    <Input label="Price Type" type="select" inputValue={priceType ? priceType : selectedRow.price_type} options={[
                        { value: 'unit', label: 'Unit' },
                        { value: 'fixed', label: 'Fixed' },
                    ]} setInputValue={setPriceType} />
                    <Input label="Price" name="price_unit" type="number"
                        hidden={priceType === 'fixed'} inputValue={selectedRow.price_unit} />
                    <Input label="Unit" placeholder="Denom Unit Name, ex: kWh, m^3" name="denom_unit"
                        hidden={priceType === 'fixed'} inputValue={selectedRow.denom_unit}
                    />
                    <Input label="Price" name="price_fixed" type="number"
                        hidden={priceType === 'unit'} inputValue={selectedRow.price_fixed} />
                    <Input label="Tax Type" name="tax" type="select"
                        options={[
                            { value: 'value', label: 'Value' },
                            { value: 'percentage', label: 'Percentage' },
                        ]}
                        setInputValue={setTaxType} inputValue={taxType ? taxType : selectedRow.tax} />
                    <Input label="Tax Value" hidden={taxType === 'value'} inputValue={selectedRow.tax_value} />
                    <Input label="Tax Amount" hidden={taxType === 'percentage'} inputValue={selectedRow.tax_amount} />
                </form>
            </Modal>
            <Table
                    columns={columnsService}
                    data={service.items}
                    loading={loading}
                    pageCount={service.total_pages}
                    fetchData={useCallback((pageIndex, pageSize, search) => {
                        dispatch(getBuildingService( pageIndex, pageSize, search, selected, sGroupFilter.value));
                        // eslint-disable-next-line react-hooks/exhaustive-deps
                    }, [dispatch, refreshToggle,  sGroupFilter])}
                    totalItems={service.total_items}
                    filters={[
                        {
                            button: <Button key="Group: All"
                                label={sGroupFilter.label ? sGroupFilter.label : "Group: All"}
                                selected={sGroupFilter.label}
                            />,
                            hidex: !sGroupFilter.label,
                            label: <p>{sGroupFilter.label ? "Group: " + sGroupFilter.label : "Group: All"}</p>,
                            delete: () => { setSGroupFilter({}); },
                            component: (toggleModal) =>
                                <Filter
                                    data={serviceGroup}
                                    onClick={(el) => {
                                        setSGroupFilter(el);
                                        toggleModal(false);
                                    }}
                                    onClickAll={() => {
                                        setSGroupFilter("");
                                        toggleModal(false);
                                    }}
                                />
                        },
                    ]}
                    actions={[
                        <Button key="Add Billing Service" label="Add Billing Service" icon={<FiPlus />}
                            onClick={() => {
                                setEdit(false);
                                setRow({});

                                setAddService(true);
                            }}
                        />
                    ]}
                    onClickEdit={row => {
                        setRow(row);
                        console.log(row);
                        setPriceType(row.price_fixed > 0 ? 'fixed' : 'unit');
                        setTaxType(row.tax);
                        setEdit(true);
                        setAddService(true);
                    }}
                    onClickDelete={row => {
                        // setRow(row);
                        dispatch(deleteBuildingService(row, ))
                        // setConfirm(true);
                    }}
                />
        </>
    )
}

export default Component;
