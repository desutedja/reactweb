import React from 'react';
import { FiX } from 'react-icons/fi'

function Component({ icon, label, onClick, selected, secondary, disabled, onClickDelete, hideX }) {
    return (
        <div className="Button Secondary" style={{ marginRight: '10px', padding: '10px 10px'}}>
            <div onClick={onClick} style={{ cursor: 'pointer', paddingRight: '5px', fontWeight: 'bold' }} > {label} </div>
            {!hideX && <FiX style={{ color: 'black', cursor: 'pointer' }} size='17' onClick={onClickDelete} />}
        </div>
    )
}

export default Component;
