import React from 'react';

import LabeledText from '../../components/LabeledText';
import Button from '../../components/Button';
import { useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { dateFormatter } from '../../utils';

const exception = [
    'modified_on', 'deleted',
    'logo'
];

function Component() {
    const selected = useSelector(state => state.management.selected);

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
                                value={el === "created_on" ? dateFormatter(selected["created_on"]) : selected[el]}
                            />
                        )}
                </div>
                <div className="Photos">
                    <Button label="Edit" onClick={() => history.push(
                        url.split('/').slice(0, -1).join('/') + "/edit"
                    )} />
                    {selected.logo ?
                        <img className="Logo" src={selected.logo} alt="logo" />
                        :
                        <img src={'https://via.placeholder.com/200'} alt="logo" />
                    }
                </div>
            </div>
        </div>
    )
}

export default Component;
