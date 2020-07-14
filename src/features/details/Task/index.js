import React, { } from 'react';
import { useSelector } from 'react-redux';

import Details from '../components/Detail';
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
        "service",
        "service_schedule",
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
    const { selected } = useSelector(state => state.task);

    return (
        <Template
            labels={["Details", "Assignee", "Requester", "Reports"]}
            contents={[
                <>
                    <Details data={selected} labels={detail} editable={false} />
                    {selected.attachment_1 ?
                        attachments.map(el => selected[el] && <img src={selected[el]} alt="Attachment" />)
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
    )
}

export default Component;
