import React from 'react';

import Profile from '../../components/Profile';
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
                    <Profile type="management" title={selected["name"]} website={selected["website"]} phone={selected["phone"]}
                        picture={selected["logo"]} data={selected} />
                </div>
            </div>
        </div>
    )
}

export default Component;
