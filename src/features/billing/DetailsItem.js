import React, { useCallback, useState } from 'react';

import LabeledText from '../../components/LabeledText';
import Button from '../../components/Button';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';

const exception = [
    'created_on', 'modified_on', 'deleted', 'additional_charges',
    'additional_charge_amount', 'penalty', 'remarks',
    'resident_building', 'resident_unit', 'resident_id'
];

function Component() {
    const headers = useSelector(state => state.auth.headers);
    const { selected, loading, unit, refreshToggle } = useSelector(state => state.billing);

    let dispatch = useDispatch();
    let history = useHistory();
    let { path, url } = useRouteMatch();

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
                        <Button label="Add Charge" onClick={() => { }} />
                        <Button label="Set Paid" onClick={() => { }} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Component;