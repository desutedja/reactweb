import React, { useState, useEffect } from 'react';

import SectionSeparator from '../../components/SectionSeparator';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { months, yearsOnRange, toMoney } from '../../utils';
import { endpointAdmin, endpointBilling } from '../../settings';
import { createBillingUnitItem, editBillingUnitItem } from '../slices/billing';
import { get } from '../slice';

import Template from "./components/TemplateWithFormik";
import moment from 'moment';
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
    const [recent, setRecent] = useState('');

    const [service, setService] = useState({});
    const [services, setServices] = useState([]);

    const { selectedItem, selected, loading } = useSelector(state => state.billing);
    const { role } = useSelector(state => state.auth);

    let dispatch = useDispatch();
    let history = useHistory();

    const building = selectedItem.resident_building ? 
          selectedItem.resident_building : selected.building_id;
    const unit = selectedItem.resident_unit ?
          selectedItem.resident_unit : selected.id;
    const resident = selectedItem.resident_id ? 
          selectedItem.resident_id : selected.resident_id;

    useEffect(() => {

        dispatch(get(endpointAdmin + '/building/service' +
            '?page=1' +
            '&building_id=' + building + 
            '&search=' +
            '&limit=1000',

            res => {
                const { items } = res.data.data;
                setServices(items.map(el => ({
                    label: el.name,
                    value: el.id,
                    price_type: el.price_type,
                    price_fixed: el.price_fixed,
                    price_unit: el.price_unit,
                    unit: el.denom_unit,
                })));
                selectedItem.id && setService(items.find(el => el.id === selectedItem.service))
            }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ selectedItem.id ]);

    useEffect(() => {
        service.price_type === 'unit' && dispatch(get(endpointBilling + '/management/billing/get_latest_usage_unit' +
            '?unit_id=' + unit + 
            '&service_id=' + service.value,

            res => {
                setPrevious(res.data.data.recent_usage);
            }));
    }, [dispatch, unit, service])

    return (
        <Template
            slice="billing"
            payload={selectedItem.id ? {
                ...billingPayload, ...selectedItem,
            } : {
                ...billingPayload,
                year: moment().format("yyyy", "year") //default value to 2020 
            }}
            schema={billingSchema}
            formatValues={values => ({
                ...values,
                previous_usage: service.price_type === 'fixed' ? 0 : parseFloat(values.previous_usage),
                recent_usage: service.price_type === 'fixed' ? 1 : parseFloat(values.recent_usage),
                year: parseInt(values.year, 10),
                resident_building: building,
                resident_unit: unit,
                resident_id: resident,
            })}
            edit={data => dispatch(editBillingUnitItem(data, selectedItem, history, role))}
            add={data => dispatch(createBillingUnitItem(data, selectedItem, history, role))}
            renderChild={props => {
                const { setFieldValue, values, errors } = props;

                return (
                    <Form className="Form">
                        <Input {...props} label="Service" options={services} onChange={el => {
                            console.log('changed');
                            if (el.price_type === 'fixed') {
                                setPrevious(0);
                                setRecent(1);
                            } else {
                                setPrevious('');
                                setRecent('');
                            }
                            setService(el);
                        }} />
                        <div>
                            <div>Pricing Type : {service.price_type}</div>
                            <div>Price : {toMoney(service.price_type === 'fixed' ? 
                                service.price_fixed : service.price_unit)} {service.price_type === 'unit' && <span>/{service.unit}</span>}</div>
                        </div>
                        <SectionSeparator />
                        <Input {...props} label="Month" options={months} />
                        <Input {...props} label="Year" options={yearsOnRange(10)} />
                        <Input {...props} label="Name" placeholder="Billing description e.g. Electricity for July 2020" />
                        <Input {...props} label="Previous Usage" externalValue={previous} suffix={service.unit} 
                            hidden={service.price_type==='fixed'}/>
                        <Input {...props} label="Recent Usage" externalValue={recent} suffix={service.unit} 
                            hidden={service.price_type==='fixed'}/>
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
