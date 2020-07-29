import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
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
import { FiSearch, FiCheck, FiMapPin, FiUserPlus } from 'react-icons/fi';

import Button from '../../../components/Button';
import Input from '../../../components/Input';
import Filter from '../../../components/Filter';
import Details from '../components/Detail';
import Modal from '../../../components/Modal';
import Template from '../components/Template';

import { Card, CardHeader, CardFooter, CardTitle, CardBody, CardLink } from 'reactstrap';

import { useParams } from 'react-router-dom';
import { get } from '../../slice';
import { getTask, resolveTask, reassignTask, setSelected } from '../../slices/task';
import { endpointTask, endpointManagement, taskPriorityColor, taskStatusColor } from '../../../settings';

const attachments = [
    "attachment_1",
    "attachment_2",
    "attachment_3",
    "attachment_4",
    "attachment_5",
]

function Component() {
    const [modal, setModal] = useState(false);
    const [mapModal, setMapModal] = useState(false);
    const [historyModal, setHistoryModal] = useState(false);
    const [image, setImage] = useState('');
    const [data, setData] = useState({});
    const [lat, setLat] = useState(0.000);
    const [long, setLong] = useState(0.000);

    const [assign, setAssign] = useState(false);
    const [resolve, setResolve] = useState(false);
    const [staff, setStaff] = useState({});
    const [staffs, setStaffs] = useState([]);
    const [search, setSearch] = useState('');

    const history = useHistory();

    const { refreshToggle } = useSelector(state => state.task);
    const { role } = useSelector(state => state.auth);

    let dispatch = useDispatch();
    let { id } = useParams();

    useEffect(() => {
        dispatch(get(endpointTask + '/admin/' + id, res => {
            setData(res.data.data);
        }))
    }, [dispatch, id, refreshToggle])


    useEffect(() => {
        let staffRole = data.task_type === 'security' ? 'security' :
            data.task_type === 'service' ? 'technician' : 'courier';

        assign && (!search || search.length >= 1) && dispatch(get(endpointManagement + '/admin/staff/list' +
            '?limit=5&page=1&max_ongoing_task=1' +
            '&staff_role=' + staffRole + "&status=active" +
            (data.priority === "emergency" ? '&is_ongoing_emergency=true' : '') +
            '&search=' + search, res => {
                let data = res.data.data.items;

                let formatted = data.map(el => ({
                    label: el.firstname + ' ' + el.lastname,
                    value: el.id
                }));

                setStaffs(formatted);
            }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, search, data]);

    return (
        <>
            <Modal
                width="750px"
                title="Task History"
                disableFooter={true}
                isOpen={historyModal}
                toggle={() => setHistoryModal(false)}
            >
                <Timeline align="alternate">
                    {data.task_logs && data.task_logs.map((el, index) =>
                        <TimelineItem>
                            <TimelineSeparator>
                                <TimelineDot />
                                {index === (data.task_logs.length - 1) ||
                                    <TimelineConnector />}
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
            <Modal disableFooter isOpen={modal} toggle={() => setModal(false)}>
                <img src={image} alt='attachment' style={{
                    maxHeight: 600,
                    maxWidth: '100%',
                }} />
            </Modal>
            <Modal disableFooter disableHeader isOpen={mapModal} toggle={() => setMapModal(false)}>
                <div style={{ height: '40rem', width: '100%' }}>
                    <GoogleMapReact
                        bootstrapURLKeys={{ key: 'AIzaSyB2COXmiUjYMi651In_irBIHaKnT17L_X8' }}
                        defaultCenter={{
                            lat: -6.2107863,
                            lng: 106.8137977,
                        }}
                        zoom={18}
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
            <Modal isOpen={resolve} toggle={() => setResolve(false)} disableHeader
                okLabel="Yes"
                onClick={() => {
                    setResolve(false);
                    dispatch(resolveTask({ ...data, id: data.task_id }));
                }}
                cancelLabel="No"
                onClickSecondary={() => {
                    setResolve(false);
                }}
            >
                Are you sure you want to resolve this task?
            </Modal>
            <Modal isOpen={assign} toggle={() => setAssign(false)} disableHeader
                disableFooter={staffs.length === 0}
                okLabel="Yes"
                onClick={() => {
                    setStaff({});
                    setAssign(false);
                    dispatch(reassignTask({
                        "task_id": data.id,
                        "assignee_id": staff.value,
                    }));
                }}
                cancelLabel="No"
                onClickSecondary={() => {
                    setStaff({});
                    setAssign(false);
                }}
            >
                Choose assignee:
                {staffs.length !== 0 && !staff.value && <Input label="Search" icon={<FiSearch />}
                    compact inputValue={search} setInputValue={setSearch} />}
                <Filter data={staff.value ? [staff] : staffs} onClick={el => setStaff(el)} />
                {staffs.length === 0 && <p style={{
                    fontStyle: 'italic'
                }}>No elligible staff found.</p>}
            </Modal>
            <Template
                transparent
                loading={!data.task_id}
                labels={["Details"]}
                contents={[
                    <>
                        <Column style={{ width: '100%' }}>
                            <Row>
                                <Column style={{ flex: '6', display: 'block' }}>
                                    <Card style={{ marginRight: '20px', marginBottom: '20px' }}>
                                        <CardHeader>
                                            <TwoColumn first={data.ref_code} second={
                                                <div>
                                                    <b>{toSentenceCase(data.task_type)}</b>
                                                    {data.task_specialization && <b>{" - " + toSentenceCase(data.task_specialization)}</b>}
                                                    <b> Type</b>
                                                </div>
                                            } />
                                        </CardHeader>
                                        <CardBody>
                                            <Row style={{ justifyContent: "space-between", alignItems: "bottom" }}>
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
                                                <div style={{ color: 'rgba(0, 0, 0, 0.768)' }}>
                                                    {data.description || <i>No Description</i>}
                                                </div>
                                            </div>
                                        </CardBody>
                                        <CardFooter>
                                            <div style={{ textAlign: 'right', padding: '5px' }}>
                                                <Link to={"/" + role + "/chat/" + data.ref_code} onClick={() => {
                                                    dispatch(setSelected(data));
                                                    history.push("/" + role + "/chat");
                                                }}><MdChatBubble size="17" /> Go to chatroom</Link>
                                            </div>
                                        </CardFooter>
                                    </Card>
                                    <Card style={{ marginRight: '20px', marginBottom: '20px' }}>
                                        <CardBody>
                                            <h5>Attachment</h5>
                                            <hr />
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
                                            <hr />
                                            <Column style={{ lineHeight: "1.5em" }}>
                                                {data.task_reports?.length > 0 ? <>
                                                    {data.task_reports.map((el, index) =>
                                                        <>
                                                            <Row>
                                                                <div>
                                                                    <div><b> Report {index + 1} by {el.assignee_name} </b></div>
                                                                    <small>
                                                                        Created At: {dateTimeFormatter(el.created_on)}
                                                                    </small>
                                                                </div>
                                                            </Row>
                                                            <Row>
                                                                {el.description}
                                                            </Row>
                                                            <hr />
                                                            <Row>
                                                                {el.attachments > 0 &&
                                                                    [1, 2, 3, 4, 5].map(at => {
                                                                        const key = "attachment_" + at;
                                                                        return (
                                                                            !el[key] && <img src={el[key]} alt='attachment'
                                                                                onClick={() => {
                                                                                    setModal(true);
                                                                                    setImage(el[key]);
                                                                                }}
                                                                                style={{
                                                                                    height: 80,
                                                                                    aspectRatio: 1
                                                                                }}
                                                                            />)
                                                                    })}
                                                            </Row>
                                                        </>
                                                    )}
                                                </>
                                                    : <div style={{ color: 'rgba(0, 0, 0, 0.345)' }} >
                                                        <i>No Report Submitted Yet</i></div>}
                                            </Column>
                                        </CardBody>
                                    </Card>
                                </Column>
                                <Column style={{ flex: '4', display: 'block', maxWidth: '700px' }}>
                                    <Card style={{ marginRight: '20px', marginBottom: '20px' }}>
                                        <CardBody>
                                            <TwoColumn first={<h5>Status</h5>} second={
                                                <div><Link to="#" onClick={() => {
                                                    setHistoryModal(true);
                                                }}>See History</Link></div>
                                            } />
                                            <div><Pill color={taskStatusColor[data.status]}>{toSentenceCase(data.status)}</Pill></div>
                                        </CardBody>
                                        {(data.status != 'completed' && data.status != 'canceled') &&
                                            <CardFooter style={{ textAlign: "right" }}>
                                                <Button onClick={
                                                    () => setResolve(true)
                                                } icon={<FiCheck />} label="Set As Resolved" />
                                            </CardFooter>}
                                    </Card>
                                    <Card style={{ marginRight: '20px', marginBottom: '20px' }}>
                                        <CardBody>
                                            <TwoColumn first={<h5>Requester</h5>} second={
                                                data.priority === "emergency" && <div><Link to="#" onClick={() => {
                                                    setMapModal(true);
                                                    setLat(data.r_lat);
                                                    setLong(data.r_long);
                                                }}><MdLocationOn size="15" /> Last Location</Link></div>
                                            } />
                                            <Row>
                                                <div style={{ width: '50%', borderRight: '1px solid rgba(0,0,0,0.125)' }}>
                                                    <Resident id={data.resident_id}
                                                        data={{
                                                            photo: data.resident_photo, firstname: data.requester_name,
                                                            lastname: '', email: data.requester_phone
                                                        }} />
                                                </div>
                                                <div style={{ width: '50%', paddingLeft: '10px' }}>
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
                                            <h5>Assignee</h5>
                                            <Row>
                                                {data.assignee ? <>
                                                    <div style={{ width: '40%', borderRight: '1px solid rgba(0,0,0,0.125)' }}>
                                                        <Staff id={data.assignee}
                                                            data={{
                                                                photo: data.assignee_photo, firstname: data.assignee_name,
                                                                lastname: '', staff_role: data.assignee_role
                                                            }} />
                                                    </div>
                                                    <div style={{ width: '70%', paddingLeft: '10px' }}>
                                                        <b>Assigned by</b>
                                                        <div>{data.assigned_by ? data.assigned_by : "Automatic Assignment"}</div>
                                                        <div>{dateTimeFormatter(data.assigned_on)}</div>
                                                    </div></> : <div style={{ color: 'rgba(0, 0, 0, 0.345)' }} >
                                                        <i>No Assigned Staff Yet</i></div>}
                                            </Row>
                                        </CardBody>
                                        {(data.status === "rejected" || data.status === "created") && <CardFooter style={{ textAlign: "right" }}>
                                            <Button onClick={
                                                () => setAssign(true)
                                            } icon={<FiUserPlus />} label="Assign Staff" />
                                        </CardFooter>}
                                    </Card>
                                </Column>
                            </Row>
                        </Column>
                    </>,
                ]}
            />
        </>
    )
}

export default Component;
