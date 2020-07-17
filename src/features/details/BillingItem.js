import React, {  } from 'react';

import LabeledText from '../../components/LabeledText';
import Button from '../../components/Button';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { payByCash } from '../slices/billing';

const exception = [
    'created_on', 'modified_on', 'deleted', 'additional_charges',
    'additional_charge_amount', 'penalty', 'remarks',
    'resident_building', 'resident_unit', 'resident_id'
];

function Component() {
    
    const { unit } = useSelector(state => state.billing);

    let dispatch = useDispatch();
    let history = useHistory();
    let { url } = useRouteMatch();

    return (
        <div>
            <div className="Container">
                <div className="Details" style={{

                }}>
                    {Object.keys(unit.selected).filter(el => !exception.includes(el))
                        .map(el =>
                            <LabeledText
                                key={el}
                                label={el.length > 2 ? el.replace(/_/g, ' ') : el.toUpperCase()}
                                value={unit.selected[el]}
                            />
                        )}
                </div>
                <div className="Photos">
                    <div>
                        <Button label="Edit" onClick={() => history.push(
                            url.split('/').slice(0, -1).join('/') + "/edit"
                        )} />
                        <Button label="Add Additional Charge" onClick={() => { }} />
                        {unit.selected.payment === "unpaid" && <Button label="Set as Paid" onClick={() => {
                            dispatch(payByCash( {
                                "id": unit.selected.id,
                                "total": unit.selected.total,
                                "penalty_amount": unit.selected.penalty_amount,
                                "total_payment": unit.selected.total_payment,
                                "additional_charge_amount": unit.selected.additional_charge_amount,
                            }));
                        }} />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Component;