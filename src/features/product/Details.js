import React, { useState } from 'react';

import LabeledText from '../../components/LabeledText';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { patchAdminFee } from './slice';

const exception = [
    'created_on', 'modified_on', 'deleted', 'images', 'thumbnails',

];

function Component() {
    const [modal, setModal] = useState(false);
    const [modalFee, setModalFee] = useState(false);

    const [image, setImage] = useState('');
    const [adminFee, setAdminFee] = useState('');

    const headers = useSelector(state => state.auth.headers);
    const { selected } = useSelector(state => state.product);

    let dispatch = useDispatch();
    let history = useHistory();
    let { url } = useRouteMatch();

    return (
        <div>
            <Modal isOpen={modal} toggle={() => setModal(false)}>
                <img src={image} alt='attachment' style={{
                    maxHeight: 600,
                }} />
            </Modal>
            <Modal isOpen={modalFee} toggle={() => setModalFee(false)}>
                <p className="Title">Set Admin Fee</p>
                <form
                    style={{
                        marginTop: 16,
                    }}
                    onSubmit={e => {
                        dispatch(patchAdminFee(headers, {
                            item_id: selected.id,
                            merchant_id: selected.merchant_id,
                            admin_fee: parseInt(adminFee),
                            pg_fee: selected.pg_fee,
                            delivery_fee: selected.delivery_fee,
                        }, selected));

                        setModalFee(false);
                    }}
                >
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                    }}>
                        <Input compact label="Admin Fee" type="number" inputValue={adminFee}
                            setInputValue={setAdminFee} />
                        <span style={{
                            margin: 4
                        }}>
                            %
                        </span>
                    </div>
                    <div style={{
                        display: 'flex',
                        marginTop: 16,
                    }}>
                        <Button label="Cancel" secondary
                            onClick={() => setModalFee(false)}
                        />
                        <Button label="Set" />
                    </div>
                </form>
            </Modal>
            <div className="Container">
                <div className="Details" style={{

                }}>
                    {Object.keys(selected).filter(el => !exception.includes(el))
                        .map(el =>
                            <LabeledText
                                key={el}
                                label={el.length > 2 ? el.replace(/_/g, ' ') : el.toUpperCase()}
                                value={selected[el] ? (selected[el] + (el.includes('fee') ? '%' : ''))
                                    : '-'}
                            />
                        )}
                </div>
                <div className="Photos">
                    <div style={{
                        display: 'flex'
                    }}>
                        <Button label="Set Admin Fee" onClick={() => setModalFee(true)} />
                        <Button label="Edit" onClick={() => history.push(
                            url.split('/').slice(0, -1).join('/') + "/edit"
                        )} />
                    </div>
                    {selected.thumbnails ?
                        <img className="Logo" src={selected.thumbnails} alt="thumbnails" />
                        :
                        <img src={'https://via.placeholder.com/200'} alt="thumbnails" />
                    }
                </div>
            </div>
            <div className="Container" style={{
                marginTop: 16,
                flex: 1,
                flexDirection: 'column',
            }}>
                <p className="Title">Images</p>
                <div style={{
                    display: 'flex',
                    marginTop: 16,
                }}>
                    {selected.images.map((el, id) =>
                        <img src={el} alt="product images"
                            key={id}
                            height={100}
                            style={{
                                marginRight: 16,
                            }}
                            onClick={() => {
                                setImage(el);
                                setModal(true);
                            }}
                        >
                        </img>)}
                </div>

            </div>
        </div>
    )
}

export default Component;