import React from 'react';

function Component({icon, label, onClick, selected}) {
    return (
    <button
        className={selected ? "Button selected" : "Button"}
        onClick={onClick}
    >
        {icon}
        <p>{label}</p>
    </button>
    )
}

export default Component;