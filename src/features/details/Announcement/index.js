import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useRouteMatch, useParams } from 'react-router-dom';
import { dateTimeFormatter, toSentenceCase } from '../../../utils'

import { FiCopy, FiArrowUpCircle, FiTrash } from 'react-icons/fi';
import Detail from '../components/Detail';
import Modal from '../../../components/Modal';
import Loading from '../../../components/Loading';
import Button from '../../../components/Button';
import Pill from '../../../components/Pill';
import Template from '../components/Template';
import { deleteAnnouncement, publishAnnouncement, setSelected } from '../../slices/announcement';

import Content from './contents/Content';
import { get } from '../../slice';
import { endpointAdmin } from '../../../settings';

function Component() {
    const [data, setData] = useState({});

    const [ confirmDelete, setConfirmDelete ] = useState(false);
    const [ publishing, setPublishing ] = useState(false);

    let dispatch = useDispatch();
    let history = useHistory();
    let { url } = useRouteMatch();
    let { id } = useParams();

    const { role } = useSelector(state => state.auth);
    const { refreshToggle } = useSelector(state => state.announcement);

    const publishCb = useCallback(() => { 
          setPublishing(true);
          dispatch(publishAnnouncement(data, history, role)) 
    }, [data, history, role, dispatch])

    useEffect(() => {
        dispatch(get(endpointAdmin + '/announcement/preview/' + id, res => {
            setData(res.data.data);
            dispatch(setSelected(res.data.data));
        }))
    }, [dispatch, refreshToggle, id])

    const details =
        useMemo(() => ({
        'Information': [
            'id',
            { label: 'created_on', labelFormatter: () => "Created On" , valueFormatter: (val) => val ? dateTimeFormatter(val, "-") : "-" },
            { label: 'modified_on', labelFormatter: () => "Last Modified", valueFormatter: (val) => val ? dateTimeFormatter(val, "-") : "-" },
        ],
        'Consumer': [
            { label: 'consumer_role', valueFormatter: (val) => toSentenceCase(val) },
            { label: 'building', 
                disabled: (data.consumer_role === 'merchant' && data.consumer_role === 'centratama'),
                labelFormatter: () => "Target Building", 
                valueFormatter: (v) => v && v.length > 0 ? v.map( el => 
                    el.building_name
                ).join(', ') : "All" },
            { label: 'building_unit', 
                disabled: data.consumer_role !== 'resident',
                labelFormatter: () => "Target Unit", 
                valueFormatter: (v) => v && v.length > 0 ? v.map( el => el.number + " " + el.section_name ).join(', ') : "All" },
            { label: 'merchant',
                disabled: data.consumer_role !== 'merchant',
                labelFormatter: () => "Target Merchant",
                valueFormatter: (v) => v && v.length > 0 ? v.map( el => el.merchant_name ).join(', ') : "All" },
        ],
        'Publisher': [
            { label: 'publish', labelFormatter: () => "Status", valueFormatter: (val) => val === 0 ? <Pill color="secondary">Draft</Pill> : 
            <Pill color="success">Published</Pill> },
            { label: 'publisher', labelFormatter: () => "Publisher ID" },
            'publisher_name',
            { label: 'publisher_role', valueFormatter: (v) => { 
                if (v === "sa") return "Super Admin";
                else if(v === "bm") return "Building Management Admin"
                else return v;
            }},
        ],
    }),[data]);

    return (
        <>
        <Modal 
            isOpen={confirmDelete}
            disableHeader={true}
            onClick={
               () => dispatch(deleteAnnouncement(data, history, role))
            }
            toggle={() => setConfirmDelete(false)}
            okLabel={"Delete"}
            cancelLabel={"Cancel"}
        >
            Are you sure you want to delete this announcement?
        </Modal>
        <Template
            image={data.image}
            title={data.title}
            imageTitle=''
            loading={!data.id}
            labels={["Details", "Contents"]}
            contents={[
            <Detail type="Announcement" data={data} labels={details} 
                editable={data.publish === 0}
                renderButtons={() => [
                <Loading size={10} loading={publishing && data.publish === 0}> 
                    <Button label="Publish" icon={<FiArrowUpCircle/>} disabled={data.publish === 1} 
                    onClick={publishCb} />
                </Loading>,
                <Button label="Duplicate" icon={<FiCopy/>}
                    onClick={() => { 
                        history.push({
                            pathname: url.split("/").slice(0, -1).join("/") + "/add",
                        });
                        dispatch(setSelected({ ...data, duplicate: true}));
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
