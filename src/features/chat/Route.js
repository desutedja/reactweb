import React, { useCallback, useState, useEffect } from 'react';
import { Switch, Route, useHistory, useRouteMatch } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Table from '../../components/Table';
import Input from '../../components/Input';
import { post } from '../../utils';

const columns = [
    { Header: 'Name', accessor: 'name' },
]

function Component() {

    const { headers, user } = useSelector(state => state.auth);
    const { loading, source, roomID } = useSelector(state => state.chat);
    const selectedTask = useSelector(state => state.task.selected);
    const selectedTrx = useSelector(state => state.transaction.selected);

    let dispatch = useDispatch();
    let history = useHistory();
    let { path, url } = useRouteMatch();

    useEffect(() => {
        post('https://api.qiscus.com/api/v2.1/rest/login_or_register', {
            "user_id":  "superadmin" + user.id + user.email,
            "username": "Superadmin " + user.firstname,
        }, {
            headers: {
                "Content-Type": "application/json",
                "QISCUS-SDK-APP-ID": "fastelsar-tvx6nj235zm",
                "QISCUS-SDK-SECRET": "1550edebbfa59db34b3001e56c9fce73",
            }
        })
        // post('https://api.qiscus.com/api/v2.1/rest/create_room', {
        //     "room_name": "Superadmin " + source + " Chat",
        //     "creator": "superadmin" + user.id + user.email,
        //     "participants": ["superadmin" + user.id + user.email],
        // }, {
        //     headers: {
        //         "Content-Type": "application/json",
        //         "QISCUS-SDK-APP-ID": "fastelsar-tvx6nj235zm",
        //         "QISCUS-SDK-SECRET": "1550edebbfa59db34b3001e56c9fce73",
        //     }
        // })
    }, [])

    return (
        <div>
            <Switch>
                <Route exact path={path}>
                    <div style={{
                        display: 'flex',
                    }}>
                        <div style={{
                            flex: 2,
                        }}>

                        </div>
                        <div className="Container">
                            <div className="TextField">
                                Room ID: {roomID}
                            </div>
                        </div>
                    </div>
                </Route>
            </Switch>
        </div>
    )
}

export default Component;