import React, { useState } from 'react';
import Input from './Input';

const DateRangeFilter = ({ startDate, endDate, onApply, title='Created Date'}) => {
    const [start, setStart] = useState(startDate);
    const [end, setEnd] = useState(endDate);

    return (
        <div style={{
            textAlign: 'center'
        }}>
            <h3>{title}</h3>
            <Input label="Start Date" type="date" inputValue={start}
                setInputValue={setStart}
            />
            <Input label="End Date" type="date" inputValue={end}
                setInputValue={setEnd}
            />
            <button
                style={{
                    marginTop: 16
                }}
                onClick={() => {
                    onApply(start, end);
                }}
            >Apply</button>
        </div>
    )
}

export default DateRangeFilter;
