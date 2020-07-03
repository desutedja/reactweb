import React, {  } from 'react';
import Breadcrumb from '../../../components/Breadcrumb';
import { useRouteMatch } from 'react-router-dom';
import { toSentenceCase } from '../../../utils';

function Template({children}) {
    let {path} = useRouteMatch();

    return (
        <div className="row">
            <div className="col">
                <Breadcrumb title={toSentenceCase(path.split('/').reverse()[0])} />
                {children}
            </div>
        </div>
    )
}

export default Template;