import React from 'react';

function Component({onClick, onClickAll, customComponent=null,  altDataComponent=null}) {
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
