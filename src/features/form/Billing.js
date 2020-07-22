import React, { useState, useEffect } from 'react';

import SectionSeparator from '../../components/SectionSeparator';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { months, yearsOnRange } from '../../utils';
import { endpointAdmin, endpointBilling } from '../../settings';
import { createBillingUnitItem, editBillingUnitItem } from '../slices/billing';
import { get } from '../slice';

import Template from "./components/TemplateWithFormik";
import { Form } from 'formik';
import { billingSchema } from "./services/schemas";
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

function Component() {
    const [previous, setPrevious] = useState('');

    const [service, setService] = useState({});
    const [services, setServices] = useState([]);

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

    useEffect(() => {
        console.log(service);

        dispatch(get(endpointBilling + '/management/billing/get_latest_usage_unit' +
            '?unit_id=' + selected.id + 
            '&service_id=' + service.value,

            res => {
                setPrevious(res.data.data.recent_usage);
            }));
    }, [dispatch, selected.building_id, selected.id, service])

    return (
        <Template
            slice="billing"
            payload={unit.selected.id ? {
                ...billingPayload, ...unit.selected,
            } : billingPayload}
            schema={billingSchema}
            formatValues={values => ({
                ...values,
                previous_usage: parseFloat(values.previous_usage),
                recent_usage: parseFloat(values.recent_usage),
                year: parseInt(values.year, 10),
                resident_building: selected.building_id,
                resident_unit: selected.id,
                resident_id: selected.resident_id,
                resident_name: selected.resident_name,
            })}
            edit={data => dispatch(editBillingUnitItem(data, unit.selected, history, selectedUnit.id))}
            add={data => {
                console.log(data)
                // dispatch(createBillingUnitItem(data, unit.selected, history))
            }}
            renderChild={props => {
                const { errors } = props;

                return (
                    <Form className="Form">
                        <Input {...props} label="Service" options={services} onChange={el => {
                            console.log('changed');
                            setService(el);
                        }} />
                        <Input {...props} label="Month" options={months} />
                        <Input {...props} label="Year" options={yearsOnRange(10)} placeholder={new Date().getFullYear().toString()} />
                        <Input {...props} label="Name" placeholder="Billing description e.g. Electricity for July 2020" />
                        <Input {...props} label="Previous Usage" externalValue={previous} suffix={service.unit} />
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
