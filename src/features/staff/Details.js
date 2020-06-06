import React from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { dateFormatter } from '../../utils';

import Profile from '../../components/Profile';
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
                    {/* Object.keys(selected).filter(el => !exception.includes(el))
                        .map(el =>
                            <LabeledText
                                key={el}
                                label={el.length > 2 ? el.replace('_', ' ') : el.toUpperCase()}
                                value={el == "created_on" ? dateFormatter(selected["created_on"]) : selected[el]}
                            />
                        ) */}
                        <Profile type="staff" data={selected} title={selected.firstname + " " + selected.lastname} email={selected.email} 
                            phone={selected.phone} />
                </div>
            </div>
        </div>
    )
}

export default Component;
