import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Input from '../../components/Input';
import Loading from '../../components/Loading';
import IconButton from '../../components/IconButton';
import { dateTimeFormatter } from '../../utils';
import { setMessages } from './slice';
import { FiSend } from 'react-icons/fi';

import './style.css';

function Component() {
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [loadingSend, setLoadingSend] = useState(false);
    const [loadingParticipants, setLoadingParticipants] = useState(false);

    const [refresh, setRefresh] = useState(false);
    const [message, setMessage] = useState('');

    const [participants, setParticipants] = useState([]);

    const { user } = useSelector(state => state.auth);
    const { qiscus, roomID, messages } = useSelector(state => state.chat);

    let dispatch = useDispatch();

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
                }}>Room</p>
                <p style={{
                    marginBottom: 16,
                }}>{messages[0].room_name + ' (ID: ' + roomID + ')'}</p>
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