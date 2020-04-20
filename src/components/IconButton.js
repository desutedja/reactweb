import React from 'react';

function Component({className = "", onClick, disabled, children}) {
    return (
        <button
            className={"IconButton " + (disabled && "inactive ") + className}
            onClick={onClick}
        >
            {children}
        </button>
    )
}

export default Component;