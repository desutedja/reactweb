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
                {value ? 
                (value + '').includes('http') ?
                <a target="_blank" rel="noopener noreferrer" href={value}>{value}</a>
                :
                <p>{value}</p> : <p>-</p>}
            </div>
        </div>
    )
}

export default Component;
