import React from 'react';
import { useSelector } from 'react-redux';

import Profile from '../../components/Profile';

function Component() {
    const selected = useSelector(state => state.staff.selected);

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
                        <Profile type="staff" data={selected} 
                        title={selected.firstname + " " + selected.lastname} email={selected.email} 
                            phone={selected.phone} />
                </div>
            </div>
        </div>
    )
}

export default Component;
