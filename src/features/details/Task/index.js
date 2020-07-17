import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import Details from '../components/Detail';
import Modal from '../../../components/Modal';
import Template from '../components/Template';

import Reports from './contents/Reports';

const detail = {
    "Information": [
        "ref_code",
        "title",
        "description",
        "task_type",
        "priority",
        "r_lat",
        "r_long",
        "status",
        "completed_on",
    ],
    "Attachments": []
};

const attachments = [
    "attachment_1",
    "attachment_2",
    "attachment_3",
    "attachment_4",
    "attachment_5",
]

const assignee = {
    "Profile": [
        "assignee_name",
        "assigned_by",
        "assigned_on",
        "assignee",
        "assignee_fee",
    ]
};

const requester = {
    "Profile": [
        "requester",
        "requester_name",
    ]
};

function Component() {
    const [modal, setModal] = useState(false);
    const [image, setImage] = useState('');

    const { selected } = useSelector(state => state.task);

    return (
        <>
            <Modal disableFooter disableHeader isOpen={modal} toggle={() => setModal(false)}>
                <img src={image} alt='attachment' style={{
                    maxHeight: 600,
                    maxWidth: '100%',
                }} />
            </Modal>
            <Template
                labels={["Details", "Assignee", "Requester", "Reports"]}
                contents={[
                    <>
                        <Details data={selected} labels={detail} editable={false} />
                        {selected.attachment_1 ?
                            attachments.map(el => selected[el] && <img src={selected[el]} alt='attachment'
                                onClick={() => {
                                    setModal(true);
                                    setImage(selected[el]);
                                }}
                                style={{
                                    height: 80,
                                    aspectRatio: 1,
                                }} />)
                            :
                            <div style={{
                                color: 'silver',
                                marginLeft: 8,
                            }}>None</div>
                        }
                    </>,
                    <Details imgPreview={true} data={selected} labels={assignee} editable={false} />,
                    <Details data={selected} labels={requester} editable={false} />,
                    <Reports />,
                ]}
            />
        </>
    )
}

export default Component;
