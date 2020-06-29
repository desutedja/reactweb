import React from 'react';

function Component({children, center, style = {}, className}) {
    return (
        <div className={"Row " + className} style={{
            alignItems: center && 'center',
            ...style,
        }}>
            {children}
        </div>
    )
}

export default Component;