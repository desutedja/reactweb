import React, { useState, useCallback } from 'react';

import Input from '../../components/Input';
import Form from '../../components/Form';
import Modal from '../../components/Modal';
import Table from '../../components/Table';
import TableNoSelection from '../../components/TableNoSelection';
import SectionSeparator from '../../components/SectionSeparator';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { months, yearsRentangDepanBelakang } from '../../utils';
import { endpointAdmin } from '../../settings';
import { FiChevronRight } from 'react-icons/fi';
import { createBillingUnitItem, editBillingUnitItem } from '../slices/billing';
import { get } from '../slice';

const columnsService = [
    { Header: "ID", accessor: "id" },
    { Header: "Name", accessor: "name" },
    { Header: "Group", accessor: "group" },
    { Header: "Description", accessor: "description" },
    { Header: "Denom Unit", accessor: "denom_unit" },
    { Header: "Price Fixed", accessor: "price_fixed" },
    { Header: "Price Unit", accessor: "price_unit" },
    { Header: "Tax", accessor: "tax" },
    { Header: "Tax Amount", accessor: "tax_amount" },
    { Header: "Tax Value", accessor: "tax_value" },
]

function Component() {
    const [modal, setModal] = useState(false);

    const [service, setService] = useState('');
    const [serviceName, setServiceName] = useState('');
    const [services, setServices] = useState([]);
    const [servicesPageCount, setServicesPageCount] = useState(1);
    const [servicesLoading, setServicesLoading] = useState(false);

    
    const { loading, selected, unit } = useSelector(state => state.billing);
    const selectedUnit = unit.selected;

    let dispatch = useDispatch();
    let history = useHistory();

    return (
        <div>
            <Modal isOpen={modal} toggle={() => setModal(false)}
                width="1400px"
                style={{
                    display: 'flex',
                    justifyContent: 'center'
                }}
            >
                <p className="Title" style={{
                    marginBottom: 16
                }}>Select Service</p>
                <TableNoSelection
                    noSelector
                    columns={columnsService}
                    data={services}
                    loading={servicesLoading}
                    pageCount={servicesPageCount}
                    fetchData={useCallback((pageIndex, pageSize, search) => {
                        setServicesLoading(true);
                        dispatch(get(endpointAdmin + '/building/service' +
                            '?page=' + (pageIndex + 1) +
                            '&building_id=' + selected.building_id +
                            // '&group=' + servicesGroup +
                            '&search=' + search +
                            '&limit=' + pageSize,
                            
                            res => {
                                const { items, total_pages } = res.data.data;
                                setServices(items);
                                setServicesPageCount(total_pages);

                                setServicesLoading(false);
                            }));
                        // eslint-disable-next-line react-hooks/exhaustive-deps
                    }, [ selected])}
                    onClickResolve={row => {
                        setService(row.id);
                        setServiceName(row.name);
                        setModal(false);
                    }}
                />
            </Modal>
            <Form
                onSubmit={data => {
                    selectedUnit.id ?
                        dispatch(editBillingUnitItem( data, selected, history, selectedUnit.id))
                        :
                        dispatch(createBillingUnitItem( data, selected, history))
                }}
                loading={loading}
            >
                <Input label="Service: All" icon={<FiChevronRight />} inputValue={
                    selectedUnit.service_name ? selectedUnit.service_name :
                    serviceName}
                    onClick={() => setModal(true)}
                />
                <Input label="Service" hidden inputValue={selectedUnit.service ? selectedUnit.service
                    : service} />
                <Input label="Name" inputValue={selectedUnit?.name} />
                <Input label="Previous Usage" type="number" inputValue={selectedUnit?.previous_usage + ''} />
                <Input label="Recent Usage" type="number" inputValue={selectedUnit?.recent_usage + ''} />
                <Input label="Remarks" type="textarea" inputValue={selectedUnit?.remarks} />
                <Input label="Month" type="select" options={months} inputValue={selectedUnit?.month} />
                <Input label="Year" type="select"  options={yearsRentangDepanBelakang(10)} inputValue={selectedUnit?.year} />
                {/* <Input label="Due Date" type="date" inputValue={selectedUnit.due_date?.split('T')[0]} /> */}
                <SectionSeparator />
            </Form>
        </div>
    )
}

export default Component;
