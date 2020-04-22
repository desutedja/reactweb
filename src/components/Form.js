import React, { useRef, useState } from 'react';
import Button from './Button';
import SectionSeparator from './SectionSeparator';
import Loading from './Loading';
import { storageRef } from '../firebase';


function Component({ children, onSubmit, loading }) {
    let formRef = useRef();

    return (
        <form ref={formRef} className="Form" onSubmit={e => {
            e.preventDefault();

            const formData = new FormData(formRef.current);
            const allEntries = [...formData.entries()].reduce((all, entry) => {
                if (entry[1] instanceof File) {
                    console.log(entry[0], 'is a file, uploading...');

                    let ref = storageRef.child('building_logo/' + Date.now() + '-' + entry[1].name);
                    ref.put(entry[1]).then(function (snapshot) {
                        console.log(snapshot, 'File uploaded!');

                        snapshot.ref.getDownloadURL().then(url => all[entry[0]] = url);
                    });
                } else {
                    all[entry[0]] =
                        isNaN(parseFloat(entry[1])) || parseFloat(entry[1]) > 999999
                            ? entry[1] : parseFloat(entry[1]);
                }

                return all
            }, {});
            console.log(allEntries);

            onSubmit(allEntries);
        }}>
            {children}
            <SectionSeparator />
            <div className="Form-control">
                <Loading loading={loading}>
                    <Button label="Submit" />
                </Loading>
            </div>
        </form>
    )
}

export default Component;