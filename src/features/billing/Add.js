import React, { useState, useEffect, useCallback } from 'react';

import Input from '../../components/Input';
import Form from '../../components/Form';
import Modal from '../../components/Modal';
import Table from '../../components/Table';
import SectionSeparator from '../../components/SectionSeparator';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { get, months } from '../../utils';
import { endpointAdmin } from '../../settings';
import { FiChevronRight } from 'react-icons/fi';
import { createBillingUnitItem, editBillingUnitItem } from './slice';

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
    const [servicesGroup, setServicesGroup] = useState('');

    const headers = useSelector(state => state.auth.headers);
    const { loading, selected, unit } = useSelector(state => state.billing);
    const selectedUnit = unit.selected;

    let dispatch = useDispatch();
    let history = useHistory();

    return (
        <div>
            <Modal isOpen={modal} onRequestClose={() => setModal(false)}>
                <p className="Title" style={{
                    marginBottom: 16
                }}>Select Service</p>
                <Table
                    columns={columnsService}
                    data={services}
                    loading={servicesLoading}
                    pageCount={servicesPageCount}
                    fetchData={useCallback((pageIndex, pageSize, search) => {
                        setServicesLoading(true);
                        get(endpointAdmin + '/building/service' +
                            '?page=' + (pageIndex + 1) +
                            '&building_id=' + selected.resident_building +
                            '&group=' + servicesGroup +
                            '&search=' + search +
                            '&limit=' + pageSize,
                            headers,
                            res => {
                                const { items, total_pages } = res.data.data;
                                setServices(items);
                                setServicesPageCount(total_pages);

                                setServicesLoading(false);
                            });
                        // eslint-disable-next-line react-hooks/exhaustive-deps
                    }, [headers, servicesGroup, selected])}
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
                        dispatch(editBillingUnitItem(headers, data, history, selectedUnit.id))
                        :
                        dispatch(createBillingUnitItem(headers, data, history))
                }}
                loading={loading}
            >
                <Input label="Name" inputValue={selectedUnit?.name} />
                <Input label="Service" hidden inputValue={selectedUnit.service ? selectedUnit.service
                    : service} />
                <Input label="Select Service" icon={<FiChevronRight />} inputValue={
                    selectedUnit.service_name ? selectedUnit.service_name :
                    serviceName}
                    onClick={() => setModal(true)}
                />
                <Input label="Previous Usage" type="number" inputValue={selectedUnit?.previous_usage + ''} />
                <Input label="Recent Usage" type="number" inputValue={selectedUnit?.recent_usage + ''} />
                <Input label="Remarks" type="textarea" inputValue={selectedUnit?.remarks} />
                <Input label="Month" type="select" options={months} inputValue={selectedUnit?.month} />
                <Input label="Year" type="number" inputValue={selectedUnit?.year} />
                <Input label="Due Date" type="date" inputValue={selectedUnit.due_date?.split('T')[0]} />
                <SectionSeparator />
            </Form>
        </div>
    )
}

export default Component;