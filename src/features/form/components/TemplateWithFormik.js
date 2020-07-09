import React, { } from 'react';
import Breadcrumb from '../../../components/Breadcrumb';
import { useRouteMatch } from 'react-router-dom';
import { toSentenceCase } from '../../../utils';
import { Formik } from 'formik';
import { useSelector } from 'react-redux';

function Template({ slice, payload, schema, renderChild = () => { }, formatValues = () => {},
    edit = () => { }, add = () => { } }) {

    let { path } = useRouteMatch();

    const { selected } = useSelector((state) => state[slice]);

    return (
        <div className="row">
            <div className="col">
                <Breadcrumb title={toSentenceCase(path.split('/').reverse()[0])} />
                <Formik
                    initialValues={payload}
                    validationSchema={schema}
                    onSubmit={(values) => {
                        const data = formatValues(values);
                         
                        selected.id ?
                            edit(data)
                            :
                            add(data);
                    }}
                >
                    {props => renderChild(props)}
                </Formik>
            </div>
        </div>
    )
}

export default Template;