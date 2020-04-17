import React from 'react';

function Component({className = "", onClick, children}) {
    return (
        <button
            className={"IconButton " + className}
            onClick={onClick}
        >
            {children}
        </button>
    )
}

export default Component;