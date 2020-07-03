import React, {  } from 'react';
import Breadcrumb from '../../../components/Breadcrumb';

function Template({children}) {
    return (
        <div className="row">
            <div className="col">
                <Breadcrumb title="Add" />
                {children}
            </div>
        </div>
    )
}

export default Template;