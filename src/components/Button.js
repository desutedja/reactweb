import React from 'react';

function Component({icon, label, onClick}) {
    return (
    <button
        className="Button"
        onClick={onClick}
    >
        {icon}
        <p>{label}</p>
    </button>
    )
}

export default Component;