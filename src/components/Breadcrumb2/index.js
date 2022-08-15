import React, { Fragment, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';
import { toSentenceCase } from '../../utils';

function Breadcrumb({ title }) {
    let history = useHistory();
    let location = useLocation();

    return (
        <div className="Breadcrumb" data-testid="title">
            {location.pathname.split('/').length === 3 ?
                toSentenceCase(location.pathname.split('/')[2]) :
                location.pathname.split('/').map((el, index) =>
                    index !== 1 && index !== 3 && index !== location.pathname.split('/').length - 1 &&
                    <Fragment key={el + index}>
                        {index > 2 &&
                            <FiChevronRight style={{
                                marginLeft: 8,
                                marginRight: 8,
                            }} />}
                        <div
                            key={el + index}
                            className="Crumbs"
                            onClick={() => {
                                let array = location.pathname.split('/');
                                // it's a breadcrumb, it should be able to track back indefinitely.
                                history.push(array.splice(0, index + 1).join('/'));
                            }}>
                            {el ? toSentenceCase(el.replace(/-/g, ' ')) : ''}
                        </div>
                    </Fragment>
                )}
            {title && <FiChevronRight style={{
                marginLeft: 8,
                marginRight: 8,
            }} />}
            {title}
        </div>
    )
}

export default Breadcrumb;
