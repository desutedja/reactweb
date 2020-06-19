import React, { useState } from 'react';
import parse from 'html-react-parser';

import LabeledText from '../../components/LabeledText';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { publishAnnouncement } from './slice';

const exception = [
    'created_on', 'modified_on', 'deleted', 'title', 'description',
    'building', 'building_unit', 'publish'
];

function Component() {
    const [confirm, setConfirm] = useState(false);

    const headers = useSelector(state => state.auth.headers);
    const selected = useSelector(state => state.announcement.selected);

    let dispatch = useDispatch();
    let history = useHistory();
    let { url } = useRouteMatch();

    return (
        <div>
            <Modal isOpen={confirm} toggle={() => setConfirm(false)}>
                Are you sure you want to publish this announcement?
                <div style={{
                    display: 'flex',
                    marginTop: 16,
                }}>
                    <Button label="No" secondary
                        onClick={() => setConfirm(false)}
                    />
                    <Button label="Yes"
                        onClick={() => {
                            setConfirm(false);
                            dispatch(publishAnnouncement(headers, selected));
                        }}
                    />
                </div>
            </Modal>
            <div className="Container">
                <div className="Details" style={{

                }}>
                    {Object.keys(selected).filter(el => !exception.includes(el))
                        .map(el =>
                            <LabeledText
                                key={el}
                                label={el.length > 2 ? el.replace(/_/g, ' ') : el.toUpperCase()}
                                value={selected[el]}
                            />
                        )}
                </div>
                <div className="Photos">
                    <div>
                        <Button label="Edit" onClick={() => history.push(
                            url.split('/').slice(0, -1).join('/') + "/edit"
                        )} />
                        {!selected.publish && <Button label="Publish" onClick={() => {
                            setConfirm(true);
                        }} />}
                    </div>
                    <h3>{selected.publish ? "Published" : "Draft"}</h3>
                </div>
            </div>
            <div className="Container">
                <div>
                    <p className="Title">{selected.title}</p>
                    <div style={{
                        paddingTop: 8,
                    }}>{parse(selected.description)}</div>
                </div>
            </div>
        </div>
    )
}

export default Component;