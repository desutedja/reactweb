import React, { useState, useCallback, useEffect } from 'react';

import Input from '../../components/Input';
import Form from '../../components/Form';
import Modal from '../../components/Modal';
import TableNoSelection from '../../components/TableNoSelection';
import SectionSeparator from '../../components/SectionSeparator';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { months, yearsOnRange } from '../../utils';
import { endpointAdmin } from '../../settings';
import { FiChevronRight } from 'react-icons/fi';
import { createBillingUnitItem, editBillingUnitItem } from '../slices/billing';
import { get } from '../slice';
import Template from './components/Template';
import { current } from '@reduxjs/toolkit';

const columnsService = [
    { Header: "ID", accessor: "id" },
    { Header: "Name", accessor: "name" },
    { Header: "Unit", accessor: "denom_unit" },
    { Header: "Group", accessor: "group" },
    { Header: "Description", accessor: "description" },
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
    const [serviceUnit, setServiceUnit] = useState('');
    const [services, setServices] = useState([]);
    const [servicesPageCount, setServicesPageCount] = useState(1);
    const [servicesLoading, setServicesLoading] = useState(false);
    
    const { loading, selected, unit } = useSelector(state => state.billing);
    const selectedUnit = unit.selected;

    console.log(selectedUnit, serviceName)

    useEffect(() => {
        dispatch(get(endpointAdmin + '/building/service' +
            '?page=1&building_id=' + selected.building_id,
            res => {
                const { items } = res.data.data;
                const currentItem = items.find(item => item.id === selectedUnit.service)
                setServiceName(currentItem.name)
            }));
    })

    
    // const [selectedUnit, setSelectedUnit] = useState({})
    // useEffect(() => {
    //     setSelectedUnit(unit.selected)
    //     console.log('selectedUnit', selectedUnit)
    // }, [selectedUnit, unit])
    
    let dispatch = useDispatch();
    let history = useHistory();

    return (
        <Template>
            <Modal
                isOpen={modal} toggle={() => setModal(false)}
                disableFooter={true}
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
                    // onClickResolve={row => {
                    //     console.log(row)
                    //     setService(row.id);
                    //     setServiceName(row.name);
                    //     setModal(false);
                    // }}
                    onClickRow={row => {
                        setService(row.id);
                        setServiceName(row.name);
                        setServiceUnit(row.denom_unit);
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
                <Input label="Service: All" icon={<FiChevronRight />} inputValue={serviceName}
                    cancelValue={true}
                    onClick={() => setModal(true)}
                />
                <Input label="Service" hidden inputValue={selectedUnit.service ? selectedUnit.service
                    : service} />
                <Input label="Name" inputValue={selectedUnit?.name} />
                <Input label="Previous Usage" type="number" inputValue={selectedUnit?.previous_usage + ''}
                    addons={serviceUnit}
                />
                <Input label="Recent Usage" type="number" inputValue={selectedUnit?.recent_usage + ''}
                    addons={serviceUnit}
                />
                <Input label="Remarks" type="textarea" inputValue={selectedUnit?.remarks} />
                <Input label="Month" type="select" options={months} inputValue={selectedUnit?.month} />
                <Input label="Year" type="select"  options={yearsOnRange(10)} inputValue={selectedUnit?.year} />
                {/* <Input label="Due Date" type="date" inputValue={selectedUnit.due_date?.split('T')[0]} /> */}
                <SectionSeparator />
            </Form>
        </Template>
    )
}

export default Component;
