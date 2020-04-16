import React from 'react';

function Template({children}) {

    return (
        <div className="Auth">
            <div className="Auth-center">
                {children}
            </div>
        </div>
    )
}

export default Template;