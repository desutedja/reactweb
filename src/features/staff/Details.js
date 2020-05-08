import React from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { dateFormatter } from '../../utils';

import LabeledText from '../../components/LabeledText';
import Button from '../../components/Button';

const exception = [
    'modified_on', 'deleted',
];

function Component() {
    const selected = useSelector(state => state.staff.selected);

    let history = useHistory();
    let { path, url } = useRouteMatch();

    return (
        <div>
            <div className="Container">
                <div className="Details" style={{
                    
                }}>
                    {Object.keys(selected).filter(el => !exception.includes(el))
                        .map(el =>
                            <LabeledText
                                key={el}
                                label={el.length > 2 ? el.replace('_', ' ') : el.toUpperCase()}
                                value={el == "created_on" ? dateFormatter(selected["created_on"]) : selected[el]}
                            />
                        )}
                </div>
                <div className="Photos">
                    <Button label="Edit" onClick={() => history.push(
                        url.split('/').slice(0, -1).join('/') + "/edit"
                    )} />
                </div>
            </div>
        </div>
    )
}

export default Component;
