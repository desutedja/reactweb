import React from 'react';

function Component({icon, label, onClick, selected, secondary}) {
    return (
    <button
        className={(selected ? "Button selected" : "Button") + (secondary ? " Secondary" : "")}
        onClick={onClick}
    >
        {icon}
        <p>{label}</p>
    </button>
    )
}

export default Component;