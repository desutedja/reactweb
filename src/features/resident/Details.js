import React from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useSelector } from 'react-redux';

import LabeledText from '../../components/LabeledText';
import Button from '../../components/Button';

const exception = [
    'created_on', 'modified_on', 'deleted',
];

function Component() {
    const selected = useSelector(state => state.resident.selected);

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
                                label={el.length > 2 ? el.replace('_', ' ') : el.toUpperCase()}
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