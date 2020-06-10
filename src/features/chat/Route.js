import React, { useCallback, useState, useEffect } from 'react';
import { Switch, Route, useHistory, useRouteMatch } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Table from '../../components/Table';
import Input from '../../components/Input';
import Loading from '../../components/Loading';
import IconButton from '../../components/IconButton';
import { post, get } from '../../utils';
import { setRoomID } from './slice';
import { FiSend } from 'react-icons/fi';

const columns = [
    { Header: 'Name', accessor: 'name' },
]

function Component() {
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const { headers, user } = useSelector(state => state.auth);
    const { source, roomID } = useSelector(state => state.chat);
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

    useEffect(() => {
        // register/login
        // post('https://api.qiscus.com/api/v2.1/rest/login_or_register', {
        //     "user_id": userID,
        //     "username": "Superadmin " + user.firstname,
        // }, qheaders)

        // create room
        // post('https://api.qiscus.com/api/v2.1/rest/create_room', {
        //     "room_name": "Superadmin " + source + " Chat",
        //     "creator": userID,
        //     "participants": [userID],
        // }, qheaders, res => {
        //     dispatch(setRoomID(res.data.results.room.room_id));
        // })

        // {
        //     "results":
        //     {
        //         "room":
        //         {
        //             "room_avatar_url": "",
        //                 "room_channel_id": "",
        //                     "room_id": "17118073",
        //                         "room_name": "Superadmin task Chat",
        //                             "room_options": "{}",
        //                                 "room_type": "group"
        //         }
        //     },
        //     "status": 200
        // }

        // get rooms list
        // get('https://api.qiscus.com/api/v2.1/rest/get_user_rooms?user_id=' + userID, qheaders)

        setLoading(true);

        // get messages
        get('https://api.qiscus.com/api/v2.1/rest/load_comments?room_id=' + roomID, qheaders, res => {
            setMessages(res.data.results.comments);
            setLoading(false);
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomID, refresh])

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
                    flex: 1,
                    overflow: 'scroll',
                }}>
                    <Loading loading={loading}>
                        {messages.map(el =>
                            <div key={el.timestamp}>{el.message}</div>
                        )}
                    </Loading>
                </div>
                <div className="Container" style={{
                    flex: 0,
                    marginBottom: 0,
                }}>
                    <Input compact label="Send a message.." type="textarea"
                        inputValue={message} setInputValue={setMessage}
                    />
                    <Loading loading={loading} >
                        <IconButton onClick={() => {
                            setLoading(true);
                            post('https://api.qiscus.com/api/v2.1/rest/post_comment', {
                                "user_id": userID,
                                "room_id": roomID,
                                "message": message,
                            }, qheaders, res => {
                                setRefresh(!refresh);
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
            }}>
                <div className="TextField">
                    Room ID: {roomID}
                </div>
            </div>
        </div>
    )
}

export default Component;