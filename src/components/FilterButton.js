import React from 'react';
import { FiX } from 'react-icons/fi'

function Component({ icon, label, onClick, selected, secondary, disabled, onClickDelete, hideX }) {
    return (
        <div className="MultiSelectItem" style={{ marginRight: '10px', paddingLeft: '4px' }}>
            <div onClick={onClick} style={{ cursor: "pointer"}} > {label} </div>
            {!hideX && <div><FiX className="MultiSelectItem-delete" onClick={onClickDelete} /></div>}
        </div>
    )
}

export default Component;
