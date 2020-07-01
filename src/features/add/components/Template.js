import React, {  } from 'react';
import Breadcrumb from '../../../components/Breadcrumb';

function Template({children}) {
    return (
        <div>
            <Breadcrumb title="Add" />
            {children}
        </div>
    )
}

export default Template;