import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { TiAttachment } from 'react-icons/ti';

import moment from 'moment'
import Input from '../../components/Input';
import Modal from '../../components/Modal';
import Loading from '../../components/Loading';
import IconButton from '../../components/IconButton';
import Tab from '../../components/Tab';
import {
    updateMessages, setMessages,
    setRoom, setRoomID, setRoomUniqueID, setRooms,
    getAdminChat,
    getPICBMChat
} from './slice';
import { FiSend } from 'react-icons/fi';

import './style.css';
import { post } from '../slice';
import { endpointAsset } from '../../settings';

const topics = [
    { label: "All", value: "merchant_trx,service,security,billing,personal,help" },
    { label: "Transaction", value: "merchant_trx" },
    { label: "Service", value: "service" },
    { label: "Security", value: "security" },
    { label: "Billing", value: "billing" },
    { label: "Direct", value: "personal" },
    { label: "Help", value: "help" },
];

function Component() {
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [loadingSend, setLoadingSend] = useState(false);
    const [loadingParticipants, setLoadingParticipants] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [loadingRooms, setLoadingRooms] = useState(false);

    const history = useHistory();
    const uploadFile = useRef();

    const [refresh, setRefresh] = useState(false);
    const [message, setMessage] = useState('');
    const [preview, setPreview] = useState(false);
    const [image, setImage] = useState('');

    const [participants, setParticipants] = useState([]);
    const [topic, setTopic] = useState(topics[0]);

    const { user, role } = useSelector(state => state.auth);
    const { qiscus, room, rooms,
        roomID, roomUniqueID, messages,
        reloadList, lastMessageOnRoom, loading
    } = useSelector(state => state.chat);

    let dispatch = useDispatch();
    let messageBottom = useRef();

    useEffect(() => {
        !!messages.length && messageBottom.current.scrollIntoView({ behavior: 'smooth' });
    }, [messages])

    useEffect(() => {
        setLoadingParticipants(true);
        roomUniqueID && qiscus.getParticipants && qiscus.getParticipants(roomUniqueID)
            .then(function (participants) {
                // Do something with participants
                console.log("participants", participants);
                setParticipants(participants.participants);
                setLoadingParticipants(false);
            })
            .catch(function (error) {
                // Do something if error occured
            })
    }, [qiscus, roomUniqueID]);

    useEffect(() => {
        var options = {
            // last_comment_id: 10,
            // after: false,
            limit: 50
        }

        roomID && setLoadingMessages(true);
        roomID && qiscus.loadComments && qiscus.loadComments(roomID, options)
            .then(function (comments) {
                // On success
                dispatch(setMessages(comments.reverse()));
                setLoadingMessages(false);
                messageBottom.current.scrollIntoView();

                qiscus.readComment(roomID, room.last_comment_id);
                qiscus.receiveComment(roomID, room.last_comment_id);
            })
            .catch(function (error) {
                // On error
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [qiscus, room, roomID]);

    useEffect(() => {
        var options = {
            // last_comment_id: 10,
            // after: false,
            limit: 50
        }

        roomID && qiscus.loadComments && qiscus.loadComments(roomID, options)
            .then(function (comments) {
                // On success
                dispatch(setMessages(comments.reverse()));
                messageBottom.current.scrollIntoView();

                qiscus.readComment(roomID, room.last_comment_id);
                qiscus.receiveComment(roomID, room.last_comment_id);
            })
            .catch(function (error) {
                // On error
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [qiscus, reloadList]);

    useEffect(() => {
        
        if (role === "sa") 
            dispatch(getAdminChat(topic.value, 0, 50, ''));
        else
            dispatch(getPICBMChat(topic.value, 0, 50, ''));
        

        var params = {
            page: 1,
            limit: 100,
            show_participants: false,
            show_empty: false
        }

        setLoadingRooms(true);
        qiscus && qiscus.loadRoomList && qiscus.loadRoomList(params)
            .then(function (rooms) {
                // On success
                dispatch(setRooms(rooms));
                // Isa: To prevent reloading comments twice when room is set, don't set room after load list,
                //      usually, rooms are already chosen, but when not, just let the user pick which room
                //dispatch(setRoom(rooms[0]));
                //!roomID && dispatch(setRoomID(rooms[0].id));
                !roomUniqueID && dispatch(setRoomUniqueID(rooms[0].unique_id));
                // dispatch(setReloadList(false));
                setLoadingRooms(false);
            })
            .catch(function (error) {
                // On error
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, reloadList, qiscus]);
    //}, [listTopic, listPageIndex, listPageSize, listSearch, dispatch]);

    useEffect(() => {
        console.log("Last Message coming on room: ", lastMessageOnRoom)
    }, [lastMessageOnRoom]);

    const sendMessage = (text = '', type = '', payload) => {
        const messageData = message ? message : text;

        if (messageData.length === 0) return;
        setLoadingSend(true);
        qiscus.sendComment(
            roomID, messageData, null, type, payload, {
            // extra data
            name: user.firstname + ' ' + user.lastname,
            role: role === 'sa' ? 'centratama' : 'staff_pic_bm',
            merchant: null,
            building: user.building_name,
            management: user.management_name,
            data_type: type === 'file_attachment' && 'image',
            url: payload?.url,
        }).then(function (comment) {
            // On success
            dispatch(updateMessages([comment]));
            setRefresh(!refresh);
            setMessage('');
            setLoadingSend(false);
        })
    }

    function isImage(file) {
        const f = file.split(".")
        const ext = f[f.length - 1].toUpperCase()
        return ext === 'JPG' || ext === 'PNG' || ext === 'GIF' || ext === 'JPEG' || ext === 'TIFF' ||
            ext === 'EPS';
    }

    return (
        <>
            <Modal disableFooter disableHeader isOpen={preview} toggle={() => setPreview(false)}>
                <img src={image} alt='attachment' style={{
                    maxHeight: 600,
                    maxWidth: '100%',
                    objectFit: 'cover',
                }} />
            </Modal>
            <div style={{
                display: 'flex',
                height: '100%'
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 2,
                }}>
                    <div style={{
                        flex: 1,
                        paddingRight: 16,
                        paddingLeft: 16,
                        overflow: 'scroll',
                    }} >
                        <Loading loading={loadingMessages}>
                            {messages.length > 0 ? messages.map((el, index) =>
                                <div key={el.id} className={
                                    el.extras.name === user.firstname + ' ' + user.lastname ?
                                        "MessageContainer-own" : "MessageContainer"}>
                                    {index > 0 && messages[index - 1].extras.name === el.extras.name ?
                                        <div className="MessageAvatar" /> :
                                        <img alt="avatar" className="MessageAvatar" src={el.user_avatar_url} />}
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: el.extras.name === user.firstname + ' ' + user.lastname ?
                                            'flex-end' : 'flex-start',
                                    }}>
                                        {index > 0 && messages[index - 1].extras.name === el.extras.name ?
                                            null :
                                            <div className="MessageUsername" style={{ cursor: 'pointer' }} onClick={() => {
                                                const userrole = el.email.split("-")[0]
                                                const userid = el.email.split("-")[2]

                                                if (userrole === 'resident') {
                                                    history.push("/" + role + "/resident/" + userid)
                                                }
                                                if (userrole === 'staff') {
                                                    history.push("/" + role + "/staff/" + userid)
                                                }
                                                if (userrole === 'centratama') {
                                                    history.push("/" + role + "/admin/" + userid)
                                                }
                                            }}>
                                                {el.username + ' '}
                                            ({el.email.split("-")[0] === 'centratama' ? el.extras.name : el.email.split("-")[0]})
                                        </div>}
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: el.extras.name === user.firstname + ' ' + user.lastname ?
                                                'row-reverse' : 'row',
                                        }}>
                                            {/* if type is text */}

                                            {el.type === 'text' &&
                                                <div className={
                                                    el.extras.name === user.firstname + ' ' + user.lastname ?
                                                        "Message-own" : "Message"}>
                                                    {el.message}
                                                </div>}

                                            {el.type === 'file_attachment' &&
                                                <div>
                                                    {
                                                        isImage(el.message.split(" ")[1]) ?
                                                            <img
                                                                onClick={() => {
                                                                    setImage(el.message.split(" ")[1]);
                                                                    setPreview(true);
                                                                }}
                                                                alt="Attachment" src={el.message.split(" ")[1]} width="150" style={{ padding: '10px' }} /> :
                                                            <div className={el.extras.name === user.firstname + ' ' + user.lastname ? "Message-own" : "Message"}>
                                                                <TiAttachment /> <a href={el.message.split(" ")[1]}>Download Attachment</a>
                                                            </div>
                                                    }
                                                </div>
                                            }
                                            <div className="MessageTime">
                                                {moment.unix(el.unix_timestamp).fromNow()}
                                            </div>
                                        </div>
                                        {messages[index + 1]?.username !== el.username &&
                                            <div style={{
                                                height: 12
                                            }} />}
                                    </div>
                                </div>
                            ) : <h3 style={{
                                color: 'grey',
                                textAlign: 'center',
                                marginTop: 48,
                            }}>
                                    Please select a room to load messages.
                        </h3>}
                        </Loading>
                        <div style={{ float: "left", clear: "both" }}
                            ref={messageBottom}>
                        </div>
                    </div>
                    <form className="Container" style={{
                        flex: 'none',
                        height: 80,
                    }} onSubmit={e => {
                        e.preventDefault();
                        sendMessage();
                    }}>
                        <Input compact label="Send a message.." inputValue={message} setInputValue={setMessage} />
                        <Loading loading={qiscus ? (loadingSend || !qiscus.sendComment) : true} >
                            <IconButton>
                                <input ref={uploadFile} type="file" style={{
                                    display: 'none'
                                }}
                                    onChange={async () => {
                                        setMessage('');
                                        let file = uploadFile.current.files[0];

                                        setMessage('Uploading file...');
                                        setLoadingSend(true);

                                        let formData = new FormData();
                                        formData.append('file', file);

                                        dispatch(post(endpointAsset + '/file/upload', formData, res => {
                                            sendMessage('[file] ' + res.data.data.url + ' [/file]', 'file_attachment', {
                                                url: res.data.data.url,
                                            });
                                        }, err => {
                                            setMessage('');
                                            setLoadingSend(false);
                                        }))
                                    }}
                                />
                                <TiAttachment onClick={() => {
                                    uploadFile.current.click();
                                }} style={{ marginLeft: '10' }} size="30" />
                            </IconButton>
                            <IconButton onClick={() => {
                                sendMessage()
                            }}>
                                <FiSend style={{ marginLeft: '10' }} size="30" />
                            </IconButton>
                        </Loading>
                    </form>
                </div>
                <div className="Container" style={{
                    marginLeft: 16,
                    flexDirection: 'column',
                }}>
                    <Tab
                        labels={['Room List', 'Room Info']}
                        contents={[
                            <Loading loading={loading}>
                                {rooms.map((el, index) => {
                                    const opt = JSON.parse(el.options);

                                    //console.log(opt)
                                    return (<div
                                        className={"Room" + (el.id === roomID ? " selected" : "")}
                                        onClick={el.id === roomID ? null : () => {
                                            dispatch(setRoom(el));
                                            dispatch(setRoomID(el.id));
                                            dispatch(setRoomUniqueID(el.unique_id));
                                        }}
                                    >
                                        <div className="Room-left">
                                            <div className="Room-title">
                                                <p className="Room-name">{el.last_comment.room_name}</p>
                                                {opt && opt.ref_code &&
                                                    <p className="Room-subtitle">
                                                        Task Code: <a href={"/" + role + "/task/" + opt.task_id}>{opt.ref_code}</a>
                                                    </p>
                                                }
                                            </div>
                                            { /* TODO: get information about user in last_comment.extras */}
                                            <p className="Room-message">{el.last_comment.username
                                                + ': ' +
                                                (el.last_comment.length > 20 ?
                                                    el.last_comment.slice(0, 20) + '...'
                                                    : el.last_comment_message)}
                                                {" (" + moment.unix(el.last_comment.unix_timestamp).fromNow() + ")"} </p>
                                        </div>
                                        <div className="Room-right">
                                            {!!el.count_notif &&
                                                <p className="Room-unread">{el.count_notif}</p>
                                            }
                                        </div>
                                    </div>)
                                })}
                            </Loading>,
                            <>
                                <p style={{
                                    fontWeight: 'bold',
                                    marginBottom: 8,
                                }}>Room</p>
                                <p style={{
                                    marginBottom: 24,
                                }}> QiscusID: {roomID}</p>
                                <p style={{
                                    fontWeight: 'bold',
                                    marginBottom: 8,
                                }}>Participants</p>
                                <Loading loading={loadingParticipants}>
                                    {participants.map((el, index) =>
                                        <div key={index} className="Participant">
                                            <img alt="avatar" className="MessageAvatar" src={el.avatar_url} style={{
                                                marginRight: 8,
                                                marginBottom: 4,
                                                borderRadius: 4,
                                            }} />
                                            {el.username}
                                        </div>
                                    )}
                                </Loading>
                            </>,
                        ]}
                    />
                </div>
            </div>
        </>
    )
}

export default Component;
