import React, { } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { dateTimeFormatter, toSentenceCase } from '../../../utils'

import Detail from '../components/Detail';
import Button from '../../../components/Button';
import Pill from '../../../components/Pill';
import Template from '../components/Template';
import { publishAnnouncement, setSelected } from '../../slices/announcement';

import Content from './contents/Content';

const details =
{
    'Information': [
        'id',
        { label: 'created_on', lfmt: () => "Created On" , vfmt: (val) => dateTimeFormatter(val, "-") },
        { label: 'modified_on', lfmt: () => "Last Modified", vfmt: (val) => dateTimeFormatter(val, "-") },
    ],
    'Consumer': [
        { label: 'consumer_role', vfmt: (val) => toSentenceCase(val) },
        //{ label: 'consumer_id', lfmt: () => "Consumer ID" },
        { label: 'building', lfmt: () => "Target Building", vfmt: (v) => v.length > 0 ? v.map( el => el.building_name ).join(', ') : "-" },
        { label: 'building_unit', lfmt: () => "Target Unit", vfmt: (v) => v.length > 0 ? v.map( el => el.number + " " + el.section_name ).join(', ') : "-" },
    ],
    'Publisher': [
        { label: 'publish', lfmt: () => "Status", vfmt: (val) => val === 0 ? <Pill color="secondary">Draft</Pill> : 
        <Pill color="success">Published</Pill> },
        { label: 'publisher', lfmt: () => "Publisher ID" },
        'publisher_name',
        { label: 'publisher_role', vfmt: (v) => { 
            if (v === "sa") return "Super Admin";
            else if(v === "bm") return "Building Management Admin"
            else return v;
        }},
    ],
};

function Component() {
    const { selected } = useSelector(state => state.announcement);
    let dispatch = useDispatch();
    let history = useHistory();
    let { url } = useRouteMatch();

    return (
        <Template
            image={selected.image}
            title={selected.title}
            imageTitle=''
            labels={["Details", "Contents"]}
            contents={[
            <Detail type="Announcement" data={selected} labels={details} editable={selected.publish === 0}
                renderButtons={() => [
                <Button label="Publish" disabled={selected.publish === 1} 
                    onClick={() => { dispatch(publishAnnouncement(selected)) }} />,
                <Button label="Duplicate" 
                    onClick={() => { 
                        history.push({
                            pathname: url.split("/").slice(0, -1).join("/") + "/add",
                        });
                        dispatch(setSelected({ ...selected, duplicate: true}));
                    }} />,
                ]}
                />,
                <Content />,
            ]}
        />
    )
}

export default Component;
