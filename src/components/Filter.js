import React from 'react';
import { toSentenceCase } from '../utils';

function Component({ data, onClick, onClickAll }) {
    console.log("Filter -->");
    console.log(data);
    return (
        <div className="Filter">
            <div className="List">
                {onClickAll && <button
                    key="all"
                    className="ListItem"
                    onClick={onClickAll}
                >
                    All
                </button>}
                {data && data.map(el =>
                    <button
                        key={el.value ? el.value : el}
                        className={el.className === 'load-more' ? "ListItem load-more" : "ListItem"}
                        onClick={() => onClick(el)}
                    >
                        {el.label ? el.label : toSentenceCase(el)}
                    </button>
                )}
            </div>
        </div>
    )
}

export default Component;
