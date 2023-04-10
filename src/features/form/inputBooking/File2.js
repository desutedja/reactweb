import React, { useState, useRef } from 'react';
import MoonLoader from "react-spinners/MoonLoader";

// import { storageRef } from '../../../firebase';
import { Field } from 'formik';
import { FiAlertCircle } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { post } from '../../slice';
import { endpointAsset } from '../../../settings';

function FileInput2(props) {
    const {
        label = "", name, onClick, setFieldValue, type, ...inputProps
    } = props;

    const [uploading, setUploading] = useState(false);
    let uploader = useRef();
    const dispatch = useDispatch();

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
                onChange={(e) => {
                    setFieldValue(fixedName, e.target.value);
                }}
                {...inputProps}
            />
        </div>
        <input
            ref={uploader}
            accept="image/*"
            type="file"
            id={label}
            name="uploader"
            required={false}
            onChange={async () => {
                let file = uploader.current.files[0];

                setFieldValue(fixedName, 'Uploading file...');
                setUploading(true);

                let formData = new FormData();
                formData.append('file', file);

                dispatch(post(endpointAsset + '/file/upload', formData, res => {
                    setFieldValue(fixedName, res.data.data.url);
                    setUploading(false);
                }, err => {
                    setFieldValue(fixedName, 'Upload failed, please try again.');
                    setUploading(false);
                }))
            }}
            onClick={onClick}
        />
        {
            props.values.id == undefined ? (<button type='button' onClick={props.onClick}>ADD</button>) : ""
        }
    </div>;
}

export default FileInput2;
