import React from 'react';

import LabeledText from '../../components/LabeledText';
import { useSelector } from 'react-redux';

const exception = [
    'created_on', 'modified_on', 'deleted',
    'Tasks', 'lat', 'long', 'logo'
];

function Component() {
    const data = useSelector(state => state.building.selected);

    return (
        <div>
            <div className="Container">
            <div className="Photos">
                    {data.logo ?
                        <img src={data.logo} alt="logo" />
                        :
                        <img src={'https://via.placeholder.com/250'} alt="logo" />
                    }
                </div>
                <div className="Details">
                    {Object.keys(data).filter(el => !exception.includes(el))
                        .map(el =>
                            <LabeledText
                                key={el}
                                label={el.length > 2 ? el.replace('_', ' ') : el.toUpperCase()}
                                value={data[el]}
                            />
                        )}
                </div>
            </div>
        </div>
    )
}

export default Component;