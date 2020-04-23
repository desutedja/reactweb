import React from 'react';

function Component({ data, onClick, onClickAll }) {
    return (
        <div className="Filter">
            <div className="List">
                <button
                    key="all"
                    className="ListItem"
                    onClick={onClickAll}
                >
                    All
                </button>
                {data && data.map(el =>
                    <button
                        key={el.value}
                        className="ListItem"
                        onClick={() => onClick(el)}
                    >
                        {el.label}
                    </button>
                )}
            </div>
        </div>
    )
}

export default Component;