import React, { useRef } from 'react';
import Button from './Button';
import SectionSeparator from './SectionSeparator';
import Loading from './Loading';
import { Form } from 'reactstrap';

function Component({ children, onSubmit, loading, isModal=false, showSubmit = true }) {

    let formRef = useRef();

    return (
        <>
        { !isModal && <SectionSeparator /> }
        <div className={isModal ? "" : "Container"}>
            <Form innerRef={formRef} className={isModal ? "" : "Form"} onSubmit={async e => {
                e.preventDefault();

                const formData = new FormData(formRef.current);

                let dataObject = [...formData.entries()]
                    .filter(el => el[0] !== 'uploader')
                    .reduce((all, entry) => {
                        all[entry[0]] =
                        entry[1].includes('@') ? entry[1] :
                        entry[1].includes('[') ? JSON.parse(entry[1]) :
                        entry[1].includes('/') ? entry[1] :
                        entry[1].includes(entry[1].match(/[0-9]/g)) ? (parseFloat(entry[1])) :
                        entry[0].includes('date') ? (entry[1] + ' 00:00:00') :
                        entry[1].includes(':/') ? entry[1] :
                        entry[1].includes(':') ? (entry[1] + ':00') :
                        isNaN(parseFloat(entry[1])) || parseFloat(entry[1]) > 999999 ?
                        entry[1] : parseFloat(entry[1]);
                        return all
                    }, {});

                onSubmit(dataObject);
            }}>
                {children}
                {!isModal && <SectionSeparator />}
                {!isModal && showSubmit && <div className="Form-control">
                    <Loading loading={loading}>
                        <Button label="Submit" onClick={() => {
                            // console.log('sth');
                        }} />
                    </Loading>
                </div>}
            </Form>
        </div>
        </>
    )
}

export default Component;
