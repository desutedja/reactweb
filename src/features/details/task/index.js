import React, { } from 'react';
import { useSelector } from 'react-redux';

import InfoField from '../components/InfoField';
import Template from '../components/Template';

const info = [
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
    "attachment_1",
    "attachment_2",
    "attachment_3",
    "attachment_4",
    "attachment_5",
];

const assignee = [
    "assignee_name",
    "assignee_photo",
    "assigned_by",
    "assigned_on",
    "assignee",
    "assignee_fee",
];

const requester = [
    "requester",
    "requester_name",
];

function Component() {
    const { selected } = useSelector(state => state.task);

    return (
        <Template
            labels={["Info", "Assignee", "Requester", "Reports"]}
            contents={[
                <InfoField data={selected} labels={info} />,
                <InfoField data={selected} labels={assignee} />,
                <InfoField data={selected} labels={requester} />,
            ]}
        />
    )
}

export default Component;
