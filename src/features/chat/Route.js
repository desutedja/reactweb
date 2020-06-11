import React, { useCallback, useState, useEffect } from 'react';
import { Switch, Route, useHistory, useRouteMatch } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Table from '../../components/Table';
import Input from '../../components/Input';
import Loading from '../../components/Loading';
import IconButton from '../../components/IconButton';
import { post, get, dateTimeFormatter } from '../../utils';
import { setRoomID, setMessages } from './slice';
import { FiSend } from 'react-icons/fi';

import './chat.css';

const columns = [
    { Header: 'Name', accessor: 'name' },
]

function Component() {
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [loadingSend, setLoadingSend] = useState(false);
    const [loadingParticipants, setLoadingParticipants] = useState(false);

    const [refresh, setRefresh] = useState(false);
    const [message, setMessage] = useState('');

    // const [messages, setMessages] = useState([]);
    const [participants, setParticipants] = useState([]);

    const { headers, user } = useSelector(state => state.auth);
    const { qiscus, source, roomID, messages } = useSelector(state => state.chat);
    const selectedTask = useSelector(state => state.task.selected);
    const selectedTrx = useSelector(state => state.transaction.selected);

    const userID = "superadmin" + user.id + user.email;
    const qheaders = {
        "Content-Type": "application/json",
        "QISCUS-SDK-APP-ID": "fastelsar-tvx6nj235zm",
        "QISCUS-SDK-SECRET": "1550edebbfa59db34b3001e56c9fce73",
    }

    let dispatch = useDispatch();
    let history = useHistory();
    let { path, url } = useRouteMatch();

    // useEffect(() => {
    //     // get messages
    //     setLoadingMessages(true);
    //     get('https://api.qiscus.com/api/v2.1/rest/load_comments?room_id=' + roomID, qheaders, res => {
    //         setMessages(res.data.results.comments ? res.data.results.comments : []);
    //         setLoadingMessages(false);
    //     })
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [refresh]);

    useEffect(() => {
        setLoadingParticipants(true);
        qiscus.getParticipants && qiscus.getParticipants("1641e1a7-6ec4-487b-be44-3e5ad584b54c")
            .then(function (participants) {
                // Do something with participants
                console.log("participants", participants);
                setParticipants(participants.participants);
                setLoadingParticipants(false);
            })
            .catch(function (error) {
                // Do something if error occured
            })
    }, [qiscus, roomID]);

    useEffect(() => {
        var options = {
            // last_comment_id: 10,
            // after: false,
            // limit: 20
        }

        setLoadingMessages(true);
        qiscus.loadComments && qiscus.loadComments(roomID, options)
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
                            // post('https://api.qiscus.com/api/v2.1/rest/post_comment', {
                            //     "user_id": userID,
                            //     "room_id": roomID,
                            //     "message": message,
                            // }, qheaders, res => {
                            //     setRefresh(!refresh);
                            //     setMessage('');
                            //     setLoadingSend(false);
                            // })
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
                <p style={{
                    fontWeight: 'bold',
                }}>Room ID</p>
                <p style={{
                    marginBottom: 16,
                }}>{roomID}</p>
                <p style={{
                    fontWeight: 'bold',
                }}>Participants</p>
                <Loading loading={loadingParticipants}>
                    {participants.map((el, index) =>
                        <div key={index} className="Participant">
                            <img alt="avatar" className="MessageAvatar" src={el.avatar_url} style={{
                                marginRight: 8,
                            }} />
                            {el.username}
                        </div>
                    )}
                </Loading>
            </div>
        </div>
    )
}

export default Component;