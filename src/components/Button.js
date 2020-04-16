import React from 'react';

function Component({label, onClick}) {
    return (
    <button
        className="Button"
        onClick={onClick}
    >{label}</button>
    )
}

export default Component;