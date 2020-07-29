import React from 'react';

function Component({className = '', title = ''}) {
    return (
        <div className={'SectionSeparator ' + className}>
            <h5>{title}</h5>
        </div>
    )
}

export default Component;
