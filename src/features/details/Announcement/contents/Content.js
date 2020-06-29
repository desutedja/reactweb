import React, {  } from 'react';
import parse from 'html-react-parser';

import { useSelector } from 'react-redux';

function Component() {
    const selected = useSelector(state => state.announcement.selected);

    return (
        <div>
            <p className="Title">{selected.title}</p>
            <div style={{
                paddingTop: 8,
            }}>{parse(selected.description)}</div>
        </div>
    )
}

export default Component;