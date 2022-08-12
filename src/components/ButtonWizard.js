import React from 'react';
import { Button } from 'reactstrap';

function MyButton({ icon, label, onClick, selected, color, disabled, className}) {
    return (
        <Button
            className={('ButtonWizard ' + (disabled ? 'inactive' : color ? color : '')) + (className ? ' ' + className : '')}
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
            }}
            type="submit"
        >
            {icon && <span style={{
                marginBottom: 2,
            }}>
                {icon}
            </span>}
        </Button>
    )
}

export default MyButton;
