import React, { useState, useRef } from 'react';

import Modal from './Modal';
import Loading from './Loading';
import { useDispatch } from 'react-redux';
import { getFile, getFileS3, post } from '../features/slice';
import exportFromJSON from 'export-from-json';

const UploadModal = ({
    open,
    toggle,
    templateLink,
    uploadLink,
    uploadDataName,
    uploadFile,
    resultComponent = '',
    filename = 'template.xlsx'
}) => {
    const fileInput = useRef();
    const [fileUpload, setFileUpload] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [openRes, setOpenRes] = useState(false);

    let dispatch = useDispatch();

    return (
        <>
        {resultComponent &&<Modal
            title={"Result"}
            isOpen={openRes}
            toggle={() => {
                setOpenRes(false);
            }}
            okLabel={"Close"}
            disableSecondary={true}
            onClick={() => {
                setOpenRes(false);
            }}
        >
            { resultComponent(result) }
        </Modal>}
        <Modal
            isOpen={open}
            toggle={() => {
                setResult('');
                toggle();
            }}
            title="Upload Bulk"
            okLabel={"Submit"}
            disablePrimary={loading || !fileUpload}
            disableSecondary={loading}
            onClick={result ?
                () => {
                    console.log(result)
                }
                :
                () => {
                    setLoading(true);
                    let formData = new FormData();
                    formData.append(uploadDataName, fileUpload);

                    dispatch(post(uploadLink, formData, res => {
                        console.log(res.data.data);
                        exportFromJSON({ data: res.data.data.errorList, fileName: 'data', exportType: exportFromJSON.types.csv })
                        setResult(res.data.data);
                        setLoading(false);
                        if (resultComponent) {
                            setOpenRes(true)
                        }
                        toggle();
                        // resultComponent ? setOpenRes(true) : toggle();
                    }, err => {
                        setResult('');
                        setLoading(false);
                        toggle();
                    }))
                }}
        >
                <Loading loading={loading}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start'
                    }}>
                        <input
                            ref={fileInput}
                            type="file"
                            onChange={e => {
                                setFileUpload(fileInput.current.files[0]);
                            }}
                        />
                        <button onClick={() => {
                            setLoading(true);
                            dispatch(getFileS3(templateLink, filename, res => {
                                setLoading(false);
                            }))
                        }} style={{
                            marginTop: 16,
                            color: 'white'
                        }}>Download Template</button>
                    </div>
                </Loading>
        </Modal>
        </>
    )
}

export default UploadModal;
