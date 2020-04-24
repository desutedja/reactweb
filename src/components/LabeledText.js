import React from 'react';

function Component({ label, value }) {
    return (
        <div className="LabeledText">
            <div style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'space-between',
                textTransform: 'capitalize',
            }}>
                <p>{label}</p>
                <p>:</p>
            </div>
            <div style={{
                flex: 1,
                display: 'flex',
            }}>
                <p>{value ? value : '-'}</p>
            </div>
        </div>
    )
}

export default Component;