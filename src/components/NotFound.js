import React from 'react';

function NotFound({ icon, label, onClick, selected, color, disabled }) {
    return (
        <div style={{
            display: 'flex',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 128,
            fontWeight: 'bold',
        }}>404</div>
    )
}

export default NotFound;
