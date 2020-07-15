import React from 'react';

function Component({ items, onClick = () => {} }) {
    return <div style={{ display: "block" }} onClick={onClick} >
        { items.map((el, i) =>
            <div key={i}>
                {i === 0 ? <b>{el}</b> : <>{el}</>}
            </div>
        ) }
    </div>
}

export default Component;
