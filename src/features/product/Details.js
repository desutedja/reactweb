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
    const [discFee, setDiscFee] = useState('');

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
            <Modal title="Adjust Fees" okLabel={"Set Fees"} isOpen={modalFee} disableHeader={true} toggle={() => { setModalFee(false); setAdminFee(""); setDiscFee("");}}
                    onClick={() => {
                        dispatch(patchAdminFee(headers, {
                            item_id: selected.id,
                            merchant_id: selected.merchant_id,
                            admin_fee: parseInt(adminFee),
                            pg_fee: selected.pg_fee,
                            discount_fee: parseInt(discFee),
                            delivery_fee: selected.delivery_fee,
                        }, selected));
                        setModalFee(false);
                    }}
                >
                <form
                    style={{
                        marginTop: 16,
                    }}
                >
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}>
                        <Input label="Admin Fee" type="number" inputValue={adminFee !== "" ? adminFee : selected.admin_fee}
                            setInputValue={setAdminFee} />
                        <Input  label="Discount" type="number" inputValue={discFee !== "" ? discFee : selected.discount_fee}
                            setInputValue={setDiscFee} />
                    </div>
                    <div style={{
                        display: 'flex',
                        marginTop: 16,
                    }}>
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
                        <Button label="Adjust Fees & Discount" onClick={() => setModalFee(true)} />
                        <Button label="Take Down Product" onClick={() => {}} />
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
