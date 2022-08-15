import React, { useState } from 'react';
import Input from './Input';
import { FiInfo } from 'react-icons/fi';

function AgeRangeInput({ start, end, setStart, setEnd, toggle }) {
    const [startInput, setStartInput] = useState(start);
    const [endInput, setEndInput] = useState(end);
    const [error, setError] = useState(false);

    return (
        <div className="Filter">
            <Input label="Start" type="number" inputValue={start} setInputValue={setStartInput} />
            <Input label="End" type="number" inputValue={end} setInputValue={setEndInput} />
            {error && <div style={{
                marginTop: 16,
                color: 'crimson',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <FiInfo style={{
                    marginRight: 4,
                    marginTop: 4,
                }} />
                Age range is only from 10 to 85 years.
            </div>}
            <button
                style={{
                    marginTop: 16,
                    color: 'white'
                }}
                onClick={() => {
                    if (startInput < 10 || endInput > 85) { setError(true) } else {
                        setStart(startInput);
                        setEnd(endInput);
                        toggle();
                        setError(false);
                    }
                }}>Apply</button>
        </div>
    )
}

export default AgeRangeInput;
