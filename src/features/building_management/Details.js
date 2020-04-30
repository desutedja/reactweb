import React from 'react';

import LabeledText from '../../components/LabeledText';
import Button from '../../components/Button';
import { useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';

const exception = [
    'created_on', 'modified_on', 'deleted',
    'Building'
];

function Component() {
    const selected = useSelector(state => state.building_management.selected);

    let history = useHistory();
    let { path, url } = useRouteMatch();

    return (
        <div>
            <div className="Container">
                <div className="Details" style={{
                    marginLeft: 16
                }}>
                    {Object.keys(selected).filter(el => !exception.includes(el))
                        .map(el =>
                            <LabeledText
                                label={el.length > 2 ? el.replace(/_/g, ' ') : el.toUpperCase()}
                                value={selected[el]}
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