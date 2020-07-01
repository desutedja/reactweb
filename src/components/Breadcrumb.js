import React, { Fragment, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';
import { toSentenceCase } from '../utils';

function Component({ title }) {
    let history = useHistory();
    let location = useLocation();

    useEffect(() => {
        // console.log(location.pathname)
    }, [])

    return (
        <div className="Breadcrumb">
            {location.pathname.split('/').length === 3 ?
                toSentenceCase(location.pathname.split('/')[2]) :
                location.pathname.split('/').map((el, index) =>
                    index !== 1 && index !== location.pathname.split('/').length - 1 &&
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

                                if (array[1] === el && array.length > 1) {
                                    history.push('/' + el);
                                } else if (array[2] === el && array.length > 2) {
                                    history.push('/' + array[1] + '/' + el);
                                } else if (array[3] === el && array.length > 3) {
                                    history.push('/' + array[1] + '/' + array[2] + '/' + el);
                                } else {
                                    history.push(el);
                                }
                            }}>
                            {toSentenceCase(el.replace(/-/g, ' '))}
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

export default Component;