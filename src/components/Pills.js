import React from 'react';

function Component({ children, color }) {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
        }}>
            <p style={{
                backgroundColor: color,
                color: 'white',
                paddingTop: 4,
                paddingBottom: 4,
                paddingLeft: 8,
                paddingRight: 8,
                borderRadius: 8,
            }}>{children}</p>
        </div>
    )
}

export default Component;