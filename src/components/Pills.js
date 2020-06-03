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
                paddingLeft: 16,
                paddingRight: 16,
                borderRadius: 16,
            }}>{children}</p>
        </div>
    )
}

export default Component;