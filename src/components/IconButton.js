import React from 'react';

function Component({className = "", onClick, disabled, color = "", children}) {
    return (
        <button
            className={"IconButton " + (disabled ? "inactive " : "") + className}
            onClick={disabled ? null : onClick}
        >
            {children}
        </button>
    )
}

export default Component;
