import React from 'react';
import { Button } from 'reactstrap';

function Component({onClick, disabled, color = "primary", icon, children}) {
    return (
        <Button style={{ marginRight: '.2rem' }} 
            size="sm" color={color} disabled={disabled} onClick={disabled ? null : onClick}>
        {icon} {children}
        </Button>
    )
}

export default Component;
