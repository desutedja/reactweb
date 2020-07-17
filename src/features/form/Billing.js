import React, { useState, useCallback, useEffect } from 'react';

import Modal from '../../components/Modal';
import TableNoSelection from '../../components/TableNoSelection';
import SectionSeparator from '../../components/SectionSeparator';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { months, yearsOnRange } from '../../utils';
import { endpointAdmin } from '../../settings';
import { createBillingUnitItem, editBillingUnitItem } from '../slices/billing';
import { get } from '../slice';

import Template from "./components/TemplateWithFormik";
import { Form } from 'formik';
import { billingSchema } from "./schemas";
import Input from './input';
import SubmitButton from './components/SubmitButton';

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
    // const [previous, setPrevious] = useState('');

    const [service, setService] = useState({});
    const [services, setServices] = useState([]);
    const [servicesPageCount, setServicesPageCount] = useState(1);
    const [servicesLoading, setServicesLoading] = useState(false);

    const { selected, unit, loading } = useSelector(state => state.billing);
    const selectedUnit = unit.selected;

    let dispatch = useDispatch();
    let history = useHistory();

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // useEffect(() => {
    //     dispatch(get(endpointBilling + '/billing/get_latest_usage_unit' +
    //         '?unit_id=' + selected.id,
    //         '&service_id=' + selected.building_id,

    //         res => {
    //             setPrevious(res.data.data.recent_usage);
    //         }));
    // }, [dispatch, selected.building_id, selected.id, service])

    const fetchData = useCallback((pageIndex, pageSize, search) => {
        setServicesLoading(true);
        dispatch(get(endpointAdmin + '/building/service' +
            '?page=' + (pageIndex + 1) +
            '&building_id=' + selected.building_id +
            '&search=' + search +
            '&limit=' + pageSize,

            res => {
                const { total_pages } = res.data.data;
                setServicesPageCount(total_pages);

                setServicesLoading(false);
            }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selected]);

    return (
        <Template
            slice="billing"
            payload={unit.selected.id ? {
                ...billingPayload, ...unit.selected,
            } : billingPayload}
            schema={billingSchema}
            formatValues={values => ({
                ...values,
                recent_usage: parseFloat(values.recent_usage),
                year: parseInt(values.year, 10),
                resident_building: selected.building_id,
                resident_unit: selected.id,
                resident_id: selected.resident_id,
                resident_name: selected.resident_name,
            })}
            edit={data => dispatch(editBillingUnitItem(data, unit.selected, history, selectedUnit.id))}
            add={data => dispatch(createBillingUnitItem(data, unit.selected, history))}
            renderChild={props => {
                const { errors } = props;

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
                                    setService(row);
                                    setModal(false);
                                }}
                            />
                        </Modal>

                        <Input {...props} label="Service" options={services} onChange={el => {
                            console.log('changed');
                            setService(el.unit);
                        }} />
                        <Input {...props} label="Month" options={months} />
                        <Input {...props} label="Year" options={yearsOnRange(10)} />
                        <Input {...props} label="Name" placeholder="Billing description e.g. Electricity for July 2020" />
                        <Input {...props} label="Previous Usage" externalValue={services} suffix={service.unit} />
                        <Input {...props} label="Recent Usage" suffix={service.unit} />
                        <Input {...props} label="Remarks" type="textarea" />
                        <SectionSeparator />
                        <SubmitButton loading={loading} errors={errors} />
                    </Form>
                )
            }}
        />
    )
}

export default Component;
