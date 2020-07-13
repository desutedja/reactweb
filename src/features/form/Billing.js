import React, { useState, useCallback, useEffect } from 'react';

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

import Template from "./components/TemplateWithFormik";
import { Form } from 'formik';
import { billingSchema } from "./schemas";
import Input from './input';

const billingPayload = {
    service: "",
    name: "",
    previous_usage: "",
    recent_usage: "",
    month: "",
    year: "",
    remarks: "",

    service_label: "",
    month_label: "",
    year_label: "",
}

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

    useEffect(() => {
        dispatch(get(endpointAdmin + '/building/service' +
            '?page=1&building_id=' + selected.building_id,
            res => {
                const { items } = res.data.data;
                const currentItem = items.find(item => item.id === selectedUnit.service)
                setServiceName(currentItem.name)
            }));
    })

    useEffect(() => {
        dispatch(get(endpointAdmin + '/building/service' +
            '?page=1' +
            '&building_id=' + selected.building_id +
            '&search=' +
            '&limit=1000',

            res => {
                const { items } = res.data.data;
                setServices(items.map(el => ({
                    label: el.name,
                    value: el.id,
                    unit: el.denom_unit,
                })));
            }));
    })

    let dispatch = useDispatch();
    let history = useHistory();

    const fetchData = useCallback((pageIndex, pageSize, search) => {
        setServicesLoading(true);
        dispatch(get(endpointAdmin + '/building/service' +
            '?page=' + (pageIndex + 1) +
            '&building_id=' + selected.building_id +
            // '&group=' + servicesGroup +
            '&search=' + search +
            '&limit=' + pageSize,

            res => {
                const { items, total_pages } = res.data.data;
                // setServices(items);
                setServicesPageCount(total_pages);

                setServicesLoading(false);
            }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selected]);

    return (
        <Template
            slice="billing"
            payload={selected.id ? {
                ...billingPayload, ...selected,
            } : billingPayload}
            schema={billingSchema}
            formatValues={values => ({
                ...values,
            })}
            edit={data => dispatch(editBillingUnitItem(data, selected, history, selectedUnit.id))}
            add={data => dispatch(createBillingUnitItem(data, selected, history))}
            renderChild={props => {
                return (
                    <Form className="Form">
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
                                fetchData={fetchData}
                                onClickRow={row => {
                                    setService(row.id);
                                    setServiceName(row.name);
                                    setServiceUnit(row.denom_unit);
                                    setModal(false);
                                }}
                            />
                        </Modal>

                        <Input {...props} label="Service" options={services} onChange={el => {
                            console.log('changed');
                            setServiceUnit(el.unit);
                        }} />
                        <Input {...props} label="Name" />
                        <Input {...props} label="Previous Usage" suffix={serviceUnit} />
                        <Input {...props} label="Recent Usage" suffix={serviceUnit} />
                        <Input {...props} label="Remarks" type="textarea" />
                        <Input {...props} label="Month" options={months} />
                        <Input {...props} label="Year" options={yearsOnRange(10)} />
                        <button>Submit</button>
                        <SectionSeparator />
                    </Form>
                )
            }}
        />
    )
}

export default Component;
