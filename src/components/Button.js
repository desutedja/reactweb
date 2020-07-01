import React from 'react';
import { Button } from 'reactstrap';

function Component({ icon, label, onClick, selected, color, disabled }) {
    return (
        <Button
            className="Button"
            color={disabled ? 'secondary' : color ? color : "primary"}
            disabled={disabled}
            onClick={onClick}
            style={{
                marginRight: 4,
                marginLeft: 4,
                marginBottom: 8,
            }}
            type="submit"
        >
            {icon && <span style={{
                marginRight: 8,
                marginBottom: 2,
            }}>
                {icon}
            </span>}
            {label}
        </Button>
    )
}

export default Component;
