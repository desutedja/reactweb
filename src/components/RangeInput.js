import React from 'react';
import { toSentenceCase } from '../utils';

function Component({onClick, onClickAll, customComponent=null,  altDataComponent=null}) {
    // console.log(data)
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
                
            </div>
        </div>
    )
}

export default Component;
