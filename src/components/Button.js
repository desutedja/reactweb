import React from 'react';
import { Button } from 'reactstrap';

function MyButton({ icon, label, onClick, selected, color, disabled, className, fontWeight}) {
    return (
        <Button
            className={('Button ' + (disabled ? 'inactive' : color ? color : '')) + (className ? ' ' + className : '')}
            disabled={disabled}
            onClick={onClick}
            style={{
                paddingRight: 10,
                paddingLeft: 10,
                marginRight: 4,
                marginLeft: 4,
                marginBottom: 8,
                backgroundColor: color ? '' : '#244091',
                borderRadius: 6,
                fontWeight: fontWeight,
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

export default MyButton;
