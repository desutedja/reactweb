import React from 'react';
import { Button } from 'reactstrap';

function Component({onClick, disabled, color = "primary", icon, outline=true, children}) {
    return (
        <Button outline={outline} style={{ marginRight: '.2rem' }} 
            size="sm" color={color} disabled={disabled} onClick={disabled ? null : onClick}>
        {icon} {children}
        </Button>
    )
}

export default Component;
