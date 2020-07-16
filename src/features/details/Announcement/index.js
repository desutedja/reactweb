import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { dateTimeFormatter, toSentenceCase } from '../../../utils'

import { FiTrash } from 'react-icons/fi';
import Detail from '../components/Detail';
import Modal from '../../../components/Modal';
import Button from '../../../components/Button';
import Pill from '../../../components/Pill';
import Template from '../components/Template';
import { deleteAnnouncement, publishAnnouncement, setSelected } from '../../slices/announcement';

import Content from './contents/Content';

function Component() {
    const { selected } = useSelector(state => state.announcement);

    const [ confirmDelete, setConfirmDelete ] = useState(false);

    let dispatch = useDispatch();
    let history = useHistory();
    let { url } = useRouteMatch();

    const details =
        useMemo(() => ({
        'Information': [
            'id',
            { label: 'created_on', lfmt: () => "Created On" , vfmt: (val) => val ? dateTimeFormatter(val, "-") : "-" },
            { label: 'modified_on', lfmt: () => "Last Modified", vfmt: (val) => val ? dateTimeFormatter(val, "-") : "-" },
        ],
        'Consumer': [
            { label: 'consumer_role', vfmt: (val) => toSentenceCase(val) },
            { label: 'building', 
                disabled: !(selected.consumer_role === 'merchant' && selected.consumer_role === 'centratama'),
                lfmt: () => "Target Building", 
                vfmt: (v) => v && v.length > 0 ? v.map( el => el.building_name ).join(', ') : "All" },
            { label: 'building_unit', 
                disabled: selected.consumer_role !== 'resident',
                lfmt: () => "Target Unit", 
                vfmt: (v) => v && v.length > 0 ? v.map( el => el.number + " " + el.section_name ).join(', ') : "All" },
            { label: 'merchant',
                disabled: selected.consumer_role !== 'merchant',
                lfmt: () => "Target Merchant",
                vfmt: (v) => v && v.length > 0 ? v.map( el => el.merchant_name ).join(', ') : "All" },
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
    }),[selected]);

    return (
        <>
        <Modal 
            isOpen={confirmDelete}
            disableHeader={true}
            onClick={
               () => dispatch(deleteAnnouncement(selected, history))
            }
            toggle={() => setConfirmDelete(false)}
            okLabel={"Delete"}
            cancelLabel={"Cancel"}
        >
            Are you sure you want to delete this announcement?
        </Modal>
        <Template
            image={selected.image}
            title={selected.title}
            imageTitle=''
            labels={["Details", "Contents"]}
            contents={[
            <Detail type="Announcement" data={selected} labels={details} editable={selected.publish === 0}
                onDelete={() => {}}
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
                <Button color="danger" icon={<FiTrash/>} label="Delete" 
                    onClick={() => setConfirmDelete(true) } />,
                ]}
                />,
                <Content />,
            ]}
        />
        </>
    )
}

export default Component;
