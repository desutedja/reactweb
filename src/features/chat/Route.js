import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Input from '../../components/Input';
import Loading from '../../components/Loading';
import IconButton from '../../components/IconButton';
import Tab from '../../components/Tab';
import { dateTimeFormatter } from '../../utils';
import { setMessages, setRoomID, setRoomUniqueID } from './slice';
import { FiSend } from 'react-icons/fi';

import './style.css';

// avatar: ""
// comments: []
// count_notif: 2
// custom_subtitle: null
// custom_title: null
// id: 17159434
// isChannel: false
// isLoaded: false
// last_comment: {comment_before_id: 294549503, comment_before_id_str: "294549503", disable_link_preview: false, email: "superadmin4meriororen@gmail.com", extras: {…}, …}
// last_comment_id: 294549551
// last_comment_message: "test"
// last_comment_message_created_at: "2020-06-24T14:50:22Z"
// last_comment_topic_title: undefined
// name: "taskchat admin sama resident"
// options: "{}"
// participantNumber: undefined
// participants: (5) [{…}, {…}, {…}, {…}, {…}]
// room_type: "group"
// secret_code: undefined
// topics: []
// unique_id: "1641e1a7-6ec4-487b-be44-3e5ad5

function Component() {
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [loadingSend, setLoadingSend] = useState(false);
    const [loadingParticipants, setLoadingParticipants] = useState(false);
    const [loadingRooms, setLoadingRooms] = useState(false);

    const [refresh, setRefresh] = useState(false);
    const [message, setMessage] = useState('');

    const [participants, setParticipants] = useState([]);
    const [rooms, setRooms] = useState([]);

    const { user } = useSelector(state => state.auth);
    const { qiscus, roomID, roomUniqueID, messages } = useSelector(state => state.chat);

    let dispatch = useDispatch();

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
            // limit: 20
        }

        setLoadingMessages(true);
        roomID && qiscus.loadComments && qiscus.loadComments(roomID, options)
            .then(function (comments) {
                // On success
                dispatch(setMessages(comments));
                setLoadingMessages(false);
            })
            .catch(function (error) {
                // On error
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [qiscus, roomID]);

    useEffect(() => {
        var params = {
            page: 1,
            limit: 100,
            show_participants: false,
            show_empty: false
        }

        setLoadingRooms(true);
        qiscus.loadRoomList && qiscus.loadRoomList(params)
            .then(function (rooms) {
                // On success
                console.log("rooms", rooms);

                setRooms(rooms);
                !roomID && dispatch(setRoomID(rooms[0].id));
                !roomUniqueID && dispatch(setRoomUniqueID(rooms[0].unique_id));
                setLoadingRooms(false);
            })
            .catch(function (error) {
                // On error
            })
    }, [dispatch, qiscus, roomID, roomUniqueID]);

    return (
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
                    height: 584,
                    paddingRight: 16,
                    overflow: 'scroll',
                }}>
                    <Loading loading={loadingMessages}>
                        {messages.map((el, index) =>
                            <div key={el.timestamp} className={
                                el.email === "superadmin" + user.id + user.email ?
                                    "MessageContainer-own" : "MessageContainer"}>
                                {index > 0 && messages[index - 1].username === el.username ?
                                    <div className="MessageAvatar" /> :
                                    <img alt="avatar" className="MessageAvatar" src={el.user_avatar_url} />}
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: el.email === "superadmin" + user.id + user.email ?
                                        'flex-end' : 'flex-start',
                                }}>
                                    {index > 0 && messages[index - 1].username === el.username ?
                                        null :
                                        <div className="MessageUsername">{el.username}</div>}
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: el.email === "superadmin" + user.id + user.email ?
                                            'row-reverse' : 'row',
                                    }}>
                                        <div className={
                                            el.email === "superadmin" + user.id + user.email ?
                                                "Message-own" : "Message"}>{el.message}
                                        </div>
                                        <div className="MessageTime">
                                            {dateTimeFormatter(el.timestamp).split(',')[1].split(':')[0]
                                                + ':' +
                                                dateTimeFormatter(el.timestamp).split(',')[1].split(':')[1]}
                                        </div>
                                    </div>
                                    {messages[index + 1]?.username !== el.username &&
                                        <div style={{
                                            height: 12
                                        }} />}
                                </div>
                            </div>
                        )}
                    </Loading>
                </div>
                <div className="Container" style={{
                    flex: 0,
                    marginBottom: 0,
                    marginTop: 16,
                }}>
                    <Input compact label="Send a message.." type="textarea"
                        inputValue={message} setInputValue={setMessage}
                    />
                    <Loading loading={qiscus ? (loadingSend || !qiscus.sendComment) : true} >
                        <IconButton onClick={() => {
                            setLoadingSend(true);
                            qiscus.sendComment(roomID, message)
                                .then(function (comment) {
                                    // On success
                                    setRefresh(!refresh);
                                    setMessage('');
                                    setLoadingSend(false);
                                })
                                .catch(function (error) {
                                    // On error
                                })
                        }}>
                            <FiSend />
                        </IconButton>
                    </Loading>
                </div>
            </div>
            <div className="Container" style={{
                height: '100%',
                marginLeft: 16,
                flexDirection: 'column',
            }}>
                <Tab
                    labels={['Room Info', 'Room List']}
                    contents={[
                        <>
                            <p style={{
                                fontWeight: 'bold',
                                marginBottom: 8,
                            }}>Room Name</p>
                            <p style={{
                                marginBottom: 24,
                            }}>{messages[0]?.room_name + ' (ID: ' + roomID + ')'}</p>
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
                        <Loading loading={loadingRooms}>
                            {rooms.map((el, index) =>
                                <div key={index} className="Room">
                                    {el.id}
                                    {el.name}
                                    {el.last_comment.username + ': ' + el.last_comment_message}
                                    {el.count_notif}
                                </div>
                            )}
                        </Loading>
                    ]}
                />
            </div>
        </div>
    )
}

export default Component;