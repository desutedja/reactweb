import React from 'react';
import { toSentenceCase } from '../utils';

function Component({ data, onClick, onClickAll, customComponent=null,  altDataComponent=null}) {
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
                {data && data.map(el => {
                    return ( !customComponent ?
                        <button
                            key={el.value ? el.value : el}
                            className={el.className === 'load-more' ? "ListItem load-more" : "ListItem"}
                            onClick={() => onClick(el)}
                        >
                            {el.label ? el.label : toSentenceCase(el)}
                        </button> : customComponent(el, onClick)
                    );
                })}
                {altDataComponent && altDataComponent()}
            </div>
        </div>
    )
}

export default Component;
