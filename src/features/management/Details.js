import React from 'react';

import Profile from '../../components/Profile';
import { useSelector } from 'react-redux';

function Component() {
    const selected = useSelector(state => state.management.selected);

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
