import React, { } from 'react';
import { useSelector } from 'react-redux';

import Detail from '../components/Detail';
import Template from '../components/Template';

import Content from './contents/Content';

const details =
{
    'Information': [
        'consumer_id',
        'consumer_role',
        'created_on',
        'id',
        'image',
        'modified_on',
        'publish',
        'publisher',
        'publisher_name',
        'publisher_role',
        'read',
        'topic',
        'topic_ref_id',
    ],
};

function Component() {
    const { selected } = useSelector(state => state.announcement);

    return (
        <Template
            image={selected.logo}
            title={selected.name}
            website={selected.website}
            phone={selected.phone}
            labels={["Content", "Details"]}
            contents={[
                <Content />,
                <Detail type="Announcement" data={selected} labels={details} />,
            ]}
        />
    )
}

export default Component;
