import React from 'react';

function Component({ items }) {
    return <div style={{ display: "block" }} >
        { items.map((el, i) =>
            <div key={i}>
                {i === 0 ? <b>{el}</b> : <>{el}</>}
            </div>
        ) }
    </div>
}

export default Component;
