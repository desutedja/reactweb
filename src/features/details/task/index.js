import React, { } from 'react';
import { useSelector } from 'react-redux';

import Details from '../components/Detail';
import Template from '../components/Template';

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
    "Attachments": [
        "attachment_1",
        "attachment_2",
        "attachment_3",
        "attachment_4",
        "attachment_5",
    ]
};

const assignee = {
    "Profile": [
        "assignee_name",
        "assignee_photo",
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
                <Details data={selected} labels={detail} editable={false} />,
                <Details data={selected} labels={assignee} editable={false} />,
                <Details data={selected} labels={requester} editable={false} />,
            ]}
        />
    )
}

export default Component;
