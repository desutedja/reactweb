import React from 'react';

function Component({ icon, label, onClick, selected, secondary, disabled }) {
    return (
        <button
            className={(selected ? "Button selected" : "Button") + (secondary ? " Secondary" : "")
                + (disabled ? " inactive" : "")
            }
            onClick={onClick}
        >
            {icon}
            <p>{label}</p>
        </button>
    )
}

export default Component;