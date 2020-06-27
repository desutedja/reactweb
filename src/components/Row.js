import React from 'react';

function Component({children, center, style = {}}) {
    return (
        <div className="Row" style={{
            alignItems: center && 'center',
            ...style,
        }}>
            {children}
        </div>
    )
}

export default Component;