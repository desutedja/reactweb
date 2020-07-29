import React from 'react';
import { FiXCircle } from 'react-icons/fi'

function FilterButton({ icon, label, value, onClick, selected, 
    secondary, disabled, onClickDelete, hideX }) {
    return (
        <div
            className="FilterButton"
        >
            <div
                style={{ paddingRight: '5px' }}
                onClick={onClick}
            >
                {label}
            </div>
            <div
                style={{ paddingRight: '5px', fontWeight: 'bold' }}
                onClick={onClick}
            >
                {value}
            </div>
            {!hideX && <FiXCircle
                style={{ color: 'grey', cursor: 'pointer' }}
                size='17'
                onClick={onClickDelete}
            />}
        </div>
    )
}

export default FilterButton;
