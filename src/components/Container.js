import React from 'react';

function Component({children, flex = 1, style = {}}) {
    return (
        <div className="Container" style={{
            flex: flex,
            ...style
        }}>
            {children}
        </div>
    )
}

export default Component;