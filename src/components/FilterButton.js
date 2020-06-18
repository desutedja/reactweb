import React from 'react';
import { FiX } from 'react-icons/fi'

function Component({ icon, label, onClick, selected, secondary, disabled, onClickDelete, hideX}) {
    return (
        <>
        <div className="MultiSelectItem">
            <div onClick={onClick} style={{ cursor: "pointer" }} > {label} </div>
            { !hideX && <FiX className="MultiSelectItem-delete" onClick={onClickDelete} />}
        </div>
        </>
    )
}

export default Component;
