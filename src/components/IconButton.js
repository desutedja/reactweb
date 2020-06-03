import React from 'react';
import { Button } from 'reactstrap';

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
