import React, { useRef } from 'react';
import Button from './Button';
import SectionSeparator from './SectionSeparator';
import Loading from './Loading';

function Component({ children, onSubmit, loading, showSubmit = true }) {

    let formRef = useRef();

    return (
        <div className="Container">
            <form ref={formRef} className="Form" onSubmit={async e => {
                e.preventDefault();

                const formData = new FormData(formRef.current);

                let dataObject = [...formData.entries()]
                    .filter(el => el[0] !== 'uploader')
                    .reduce((all, entry) => {
                        all[entry[0]] =
                        entry[1].includes('-') ? (entry[1] + ' 00:00:00') :
                        // entry[1].includes(':') ? (entry[1] + ':00') :
                            isNaN(parseFloat(entry[1])) || parseFloat(entry[1]) > 999999 ?
                                entry[1] : parseFloat(entry[1]);

                        return all
                    }, {});

                console.log(dataObject);

                onSubmit(dataObject);
            }}>
                {children}
                <SectionSeparator />
                {showSubmit && <div className="Form-control">
                    <Loading loading={loading}>
                        <Button label="Submit" onClick={() => {
                            // console.log('sth');
                        }} />
                    </Loading>
                </div>}
            </form>
        </div>
    )
}

export default Component;
