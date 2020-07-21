import React, { useState } from 'react';

import Detail from './components/Detail';
import Template from './components/Template';

import Modal from '../../components/Modal';
import Button from '../../components/Button';
import { useSelector, useDispatch } from 'react-redux';
import { payByCash } from '../slices/billing';
import FormTemplate from '../form/components/TemplateWithFormik';
import { Formik, Field, Form } from 'formik';
import Input from '../form/input';
import SubmitButton from '../form/components/SubmitButton';
import { post } from '../slice';
import { endpointBilling } from '../../settings';

const details =
{
    'Information': [
        'created_on',
        'ref_code',
        'name',
        'group',
        'service',
        'previous_usage',
        'recent_usage',
        'price_unit',
        'denom_unit',
        'month',
        'year',
        'due_date',
        'payment',
        'payment_date',
        'subtotal',
        'tax',
        'tax_amount',
        'tax_value',
        'total',
        'total_amount',
    ],
};

function Component() {
    const [modal, setModal] = useState(false);

    const { unit } = useSelector(state => state.billing);

    let dispatch = useDispatch();

    return (
        <>
            <Modal disableFooter isOpen={modal} toggle={() => setModal(false)}
                title="Add Additional Charge"
            >
                <Formik
                    initialValues={{
                        "charge_name": '',
                        "charge_description": '',
                        "charge_price": '',
                    }}
                    onSubmit={(values) => {
                        const data = {...values, 
                            billing_id: unit.selected.id,
                            charge_price: parseInt(values.charge_price, 10),
                        }

                        console.log(data);

                        dispatch(post(endpointBilling + '/management/billing/additional-charge', data, res => {
                            setModal(false);
                        }))
                    }}
                >
                    {props => {
                        const { errors } = props;

                        return (
                            <Form className="Form">
                                <Input {...props} label="Charge Name" />
                                <Input {...props} label="Charge Description" />
                                <Input {...props} label="Charge Price" />
                                <SubmitButton errors={errors} />
                            </Form>
                        )
                    }}
                </Formik>
            </Modal>
            <Template
                loading={false}
                labels={["Details", "Additional Charges"]}
                contents={[
                    <Detail type="Billing" data={unit.selected} labels={details}
                        renderButtons={() => ([
                            <Button label="Add Additional Charge" onClick={() => {
                                setModal(true);
                            }} />,
                            unit.selected.payment === "unpaid" && <Button label="Set as Paid" onClick={() => {
                                dispatch(payByCash({
                                    "id": unit.selected.id,
                                    "total": unit.selected.total,
                                    "penalty_amount": unit.selected.penalty_amount,
                                    "total_payment": unit.selected.total_payment,
                                    "additional_charge_amount": unit.selected.additional_charge_amount,
                                }));
                            }} />
                        ])}
                    />,
                ]}
            />
        </>
    )
}

export default Component;