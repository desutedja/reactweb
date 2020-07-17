import React from 'react';

function Component({ label, value }) {
    return (
        // <div className="LabeledText">
        <div className="row no-gutters py-2">
            <div className="col-md-6 col-lg-5" style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'space-between',
                textTransform: 'capitalize',
            }}>
                <p>{label}</p>
                <p>:&nbsp;</p>
            </div>
            <div className="col ml-2" style={{
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
