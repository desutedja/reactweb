import React from 'react';

import LabeledText from '../../components/LabeledText';
import { useSelector } from 'react-redux';

function Component() {
    const data = useSelector(state => state.task.selected);

    return (
        <div>
            <div className="Container">
                {Object.keys(data).map(el =>
                    Array.isArray(data[el]) ? null :
                        <LabeledText
                            key={el}
                            label={el.length > 2 ? el.replace('_', ' ') : el.toUpperCase()}
                            value={data[el]}
                        />
                )}
            </div>
        </div>
    )
}

export default Component;