import React, { } from 'react';

import Detail from './components/Detail';
import Template from './components/Template';

import Button from '../../components/Button';
import { useSelector, useDispatch } from 'react-redux';
import { payByCash } from '../slices/billing';

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

    const { unit } = useSelector(state => state.billing);

    let dispatch = useDispatch();

    return (
        <Template
            loading={false}
            labels={["Details", "Additional Charges"]}
            contents={[
                <Detail type="Billing" data={unit.selected} labels={details}
                    renderButtons={() => ([
                        <Button label="Add Additional Charge" onClick={() => { }} />,
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
    )
}

export default Component;