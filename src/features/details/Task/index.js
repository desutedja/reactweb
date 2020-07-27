import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@material-ui/lab';
import GoogleMapReact from 'google-map-react';

import Row from '../../../components/Row';
import Resident from '../../../components/cells/Resident';
import Staff from '../../../components/cells/Staff';
import Column from '../../../components/Column';
import ThreeColumn from '../../../components/ThreeColumn';
import TwoColumn from '../../../components/TwoColumn';
import Pill from '../../../components/Pill';
import { dateTimeFormatter, toSentenceCase, task } from '../../../utils';
import { MdChatBubble, MdLocationOn } from 'react-icons/md';
import { FiMapPin } from 'react-icons/fi';

import Details from '../components/Detail';
import Modal from '../../../components/Modal';
import Template from '../components/Template';

import { Card, CardHeader, CardFooter, CardTitle, CardBody, CardLink } from 'reactstrap';

import Reports from './contents/Reports';
import { useParams } from 'react-router-dom';
import { get } from '../../slice';
import { endpointTask, taskPriorityColor, taskStatusColor } from '../../../settings';

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
        "assignee_role",
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
    const [mapModal, setMapModal] = useState(false);
    const [historyModal, setHistoryModal] = useState(false);
    const [image, setImage] = useState('');
    const [data, setData] = useState({});
    const [lat, setLat] = useState(0.000);
    const [long, setLong] = useState(0.000);

    let dispatch = useDispatch();
    let { id } = useParams();

    useEffect(() => {
        dispatch(get(endpointTask + '/admin/' + id, res => {
            setData(res.data.data);
            console.log(res.data.data)
        }))
    }, [dispatch, id])

    return (
        <>
            <Modal
                width="750px"
                title="Task History"
                disableFooter={true}
                isOpen={historyModal}
                toggle={() => setHistoryModal(false) }
                >
                    <Timeline align="alternate">
                      {data.task_logs && data.task_logs.map((el, index) => 
                          <TimelineItem>
                             <TimelineSeparator> 
                                 <TimelineDot/>
                             {index === (data.task_logs.length - 1) ||
                                 <TimelineConnector/> }
                             </TimelineSeparator>
                             <TimelineContent>
                                 <b>{toSentenceCase(el.status)}</b>
                                 <div>{dateTimeFormatter(el.created_on)}</div>
                                 <div>{el.description}</div>
                             </TimelineContent>
                          </TimelineItem>
                        )}
                    </Timeline>
            </Modal>
            <Modal disableFooter  isOpen={modal} toggle={() => setModal(false)}>
                <img src={image} alt='attachment' style={{
                    maxHeight: 600,
                    maxWidth: '100%',
                }} />
            </Modal>
            <Modal disableFooter disableHeader isOpen={mapModal} toggle={() => setMapModal(false)}>
                <div>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: 'AIzaSyB2COXmiUjYMi651In_irBIHaKnT17L_X8' }}
                    defaultCenter={{
                        lat: -6.2107863,
                        lng: 106.8137977,
                    }}
                    zoom={12}
                    onClick={({ x, y, lat, lng, event }) => {
                        console.log(lat, lng);
                    }}
                    onChange={({ center }) => {
                        console.log(center.lat, center.lng);
                    }}
                >
                    <div style={{
                        position: 'absolute',
                        transform: 'translate(-50%, -50%)'
                    }}>
                        <FiMapPin size={40} color="dodgerblue" />
                    </div>
                </GoogleMapReact>
                </div>
            </Modal>
            <Template
                transparent
                loading={!data.task_id}
                labels={["Details"]}
                contents={[
                    <>
                        <Row>
                            <Column style={{ flex: '4', display: 'block' }}>
                                <Card style={{ marginRight: '20px', marginBottom: '20px' }}>
                                    <CardHeader>
                                        <TwoColumn first={data.ref_code} second={
                                            <div>
                                            <b>{toSentenceCase(data.task_type)}</b>
                                            { data.task_specialization && <b>{" - " + toSentenceCase(data.task_specialization)}</b>}
                                            <b> Type</b>
                                            </div>
                                        } />
                                    </CardHeader>
                                    <CardBody>
                                        <Row style={{ justifyContent: "space-between", alignItems: "bottom"  }}>
                                            <CardTitle>
                                                <h5>{data.title}</h5>
                                            </CardTitle> 
                                            <div>
                                                <Pill color={taskPriorityColor[data.priority]}>
                                                    {toSentenceCase(data.priority) + " Priority"}</Pill>
                                            </div>
                                        </Row>
                                        <div style={{ display: 'column', lineHeight: '1.5em' }}>
                                            <div><small>Created At: {dateTimeFormatter(data.created_on)}</small></div>
                                            <div style={{ color: 'rgba(0, 0, 0, 0.768)'}}>
                                                {data.description || <i>No Description</i>}
                                            </div>
                                        </div>
                                    </CardBody>
                                    <CardFooter>
                                        <div style={{ textAlign: 'center', padding: '5px' }}>
                                            <Link to="#"><MdChatBubble size="17"/> Go to chatroom</Link>
                                        </div>
                                    </CardFooter>
                                </Card>
                                <Card style={{ marginRight: '20px', marginBottom: '20px' }}>
                                    <CardBody>
                                        <h5>Attachment</h5>
                                        {data.attachment_1 ?
                                            attachments.map(el => data[el] && <img src={data[el]} alt='attachment'
                                                onClick={() => {
                                                    setModal(true);
                                                    setImage(data[el]);
                                                }}
                                                style={{
                                                    height: 80,
                                                    aspectRatio: 1,
                                                }} />)
                                            :
                                            <div style={{
                                                color: 'silver',
                                            }}><i>No Attachment</i></div>
                                        }
                                    </CardBody>
                                </Card>
                                <Card style={{ marginRight: '20px', marginBottom: '20px' }}>
                                    <CardBody>
                                        <h5>Reports</h5>
                                        <Row>
                                            {data.reports ? <></>
                                                : <div style={{ color: 'rgba(0, 0, 0, 0.345)' }} >
                                            <i>No Report Submitted Yet</i></div>}
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Column>
                            <Column style={{ flex: '6', display: 'block', maxWidth: '700px' }}>
                                <Card style={{ marginRight: '20px', marginBottom: '20px' }}>
                                    <CardBody>
                                        <TwoColumn first={<h5>Status</h5>} second={
                                            <div><Link to="#" onClick={() => {
                                                setHistoryModal(true);
                                            }}>See History</Link></div>
                                            }/>
                                            <div><Pill color={taskStatusColor[data.status]}>{toSentenceCase(data.status)}</Pill></div> 
                                    </CardBody>
                                </Card>
                                <Card style={{ marginRight: '20px', marginBottom: '20px' }}>
                                    <CardBody>
                                        <TwoColumn first={<h5>Requester</h5>} second={
                                            <div><Link to="#" onClick={() => {
                                                setMapModal(true);
                                                setLat(data.r_lat);
                                                setLong(data.r_long);
                                            }}><MdLocationOn size="15"/> Last Location</Link></div>
                                            }/>
                                        <Row>
                                            <div style={{  width: '40%', borderRight: '1px solid rgba(0,0,0,0.125)' }}>
                                                <Resident id={data.resident_id} 
                                                    data={{photo: data.resident_photo, firstname: data.requester_name,
                                                    lastname: '', email: data.requester_phone}} />
                                            </div>
                                            <div style={{  width: '70%', paddingLeft: '10px' }}>
                                                <b>Location</b>
                                                <div>{data.requester_section_type + " " +
                                                         data.requester_section_name + " " +
                                                         data.requester_unit_number}  
                                                         <div>Floor {data.requester_unit_floor}</div>
                                                         <div>{data.requester_building_name}</div>
                                                </div>
                                            </div>
                                        </Row>
                                    </CardBody>
                                </Card>
                                <Card style={{ marginRight: '20px', marginBottom: '20px' }}>
                                    <CardBody>
                                        <h5>Last Assignee</h5>
                                        <Row>
                                            {data.assignee ? <>
                                            <div style={{  width: '40%', borderRight: '1px solid rgba(0,0,0,0.125)' }}>
                                                <Staff id={data.assignee} 
                                                    data={{photo: data.assignee_photo, firstname: data.assignee_name,
                                                    lastname: '', staff_role: data.assignee_role}} />
                                            </div>
                                            <div style={{  width: '70%', paddingLeft: '10px' }}>
                                                <b>Assigned by</b>
                                                <div>{data.assigned_by ? data.assigned_by : "Automatic Assignment"}</div>
                                                <div>{dateTimeFormatter(data.assigned_on)}</div>
                                                </div></> : <div style={{ color: 'rgba(0, 0, 0, 0.345)' }} >
                                            <i>No Assigned Staff Yet</i></div>}
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Column>
                        </Row>
                    </>,
                ]}
            />
        </>
    )
}

export default Component;
