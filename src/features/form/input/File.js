import React, { useState, useRef } from 'react';
import MoonLoader from "react-spinners/MoonLoader";

import { storageRef } from '../../../firebase';
import { Field } from 'formik';
import { FiAlertCircle } from 'react-icons/fi';

function FileInput(props) {
    const {
        label = "", name, onClick, setFieldValue, type, ...inputProps
    } = props;
    const { errors, touched } = inputProps;

    const [uploading, setUploading] = useState(false);
    let uploader = useRef();

    const fixedName = name ? name : label.toLowerCase().replace(/ /g, '_')

    return <div className="Input-container">
        {uploading && <div className="InputIcon">
            <MoonLoader
                size={14}
                color={"grey"}
                loading={uploading}
            />
        </div>}
        <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
        }}>
            <Field
                id={label}
                name={fixedName}
                placeholder={label}
                className={errors[name] && touched[name] && "error"}
                onChange={(e) => {
                    setFieldValue(fixedName, e.target.value);
                }}
                {...inputProps}
            />
            {errors[fixedName] && touched[fixedName] ? (
                <div className="Input-error">
                    <FiAlertCircle style={{
                        marginRight: 4
                    }} />
                    {errors ? errors[fixedName] : ''}</div>
            ) : null}
        </div>
        <input
            ref={uploader}
            accept="image/*"
            type="file"
            id={label}
            name="uploader"
            required={false}
            onChange={async (e) => {
                let file = uploader.current.files[0];

                setFieldValue(fixedName, 'Uploading file...');
                setUploading(true);

                let ref = storageRef.child('building_logo/' + Date.now() + '-' + file.name);
                await ref.put(file).then(function (snapshot) {
                    console.log(snapshot, 'File uploaded!');

                    snapshot.ref.getDownloadURL().then(url => {
                        setFieldValue(fixedName, url);
                    });

                    setUploading(false);
                })
            }}
            onClick={onClick}
        />
    </div>;
}

export default FileInput;
