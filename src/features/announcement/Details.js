import React from 'react';

import LabeledText from '../../components/LabeledText';
import Button from '../../components/Button';
import { useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';

const exception = [
    'created_on', 'modified_on', 'deleted', 'title', 'description'
];

function Component() {
    const selected = useSelector(state => state.announcement.selected);

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
                                label={el.length > 2 ? el.replace(/_/g, ' ') : el.toUpperCase()}
                                value={selected[el]}
                            />
                        )}
                </div>
                <div className="Photos">
                    <div>
                        <Button label="Edit Settings" onClick={() => history.push(
                            url.split('/').slice(0, -1).join('/') + "/edit"
                        )} />
                        <Button label="Edit Content" onClick={() => history.push(
                            url.split('/').slice(0, -1).join('/') + "/edit"
                        )} />
                    </div>
                </div>
            </div>
            <div className="Container">
                <div>
                    <p className="Title">{selected.title}</p>
                    <p style={{
                        paddingTop: 8,
                    }}>{selected.description}</p>
                </div>
            </div>
        </div>
    )
}

export default Component;