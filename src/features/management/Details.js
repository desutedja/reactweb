import React  from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import Button from '../../components/Button';
import Profile from '../../components/Profile';
import { useSelector } from 'react-redux';

function Component() {
    const selected = useSelector(state => state.management.selected);

    let dispatch = useDispatch();
    let history = useHistory();
    let { url } = useRouteMatch();

    return (
        <div>
            <div className="Container">
                <div className="Details" style={{

                }}>
                    <Profile type="management" title={selected["name"]} website={selected["website"]} phone={selected["phone"]}
                        picture={selected["logo"]} data={selected} />
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
