import React, {  } from 'react';
import { FiX } from 'react-icons/fi';

const MultiSelectItem = ({ value, onClickDelete }) => {
    return (
        <div className="MultiSelectItem">
            {value}
            <FiX className="MultiSelectItem-delete" onClick={onClickDelete} />
        </div>
    )
}

function MultiSelectInput(props) {
    const {
        label = "", inputValue, onClick
    } = props;

    return <div className="MultiSelect" onClick={inputValue.length === 0 ? onClick : undefined}>
        {inputValue.length > 0 ? inputValue.map((el, index) =>
            <MultiSelectItem
                key={index}
                value={el.value}
                onClickDelete={el.onClickDelete} />) :
            <p style={{ color: 'grey' }}>
                {label}
            </p>
        }
    </div>;

}

export default MultiSelectInput;
