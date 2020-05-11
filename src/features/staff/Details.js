import React from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { dateFormatter } from '../../utils';

import LabeledText from '../../components/LabeledText';
import Button from '../../components/Button';

const exception = [
    'created_on', 'modified_on', 'deleted', 'photo'
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
                    {selected.photo ?
                        <img className="Logo" src={selected.photo} alt="photo_staff" />
                        :
                        <img src={'https://via.placeholder.com/200'} alt="photo_staff" />
                    }
                </div>
            </div>
        </div>
    )
}

export default Component;
