import React, { useState } from 'react';

import LabeledText from '../../components/LabeledText';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';

const exception = [
    'created_on', 'modified_on', 'deleted', 'images', 'thumbnails',

];

function Component() {
    const [modal, setModal] = useState(false);
    const [image, setImage] = useState('');

    const selected = useSelector(state => state.product.selected);

    let history = useHistory();
    let { path, url } = useRouteMatch();

    return (
        <div>
            <Modal isOpen={modal} onRequestClose={() => setModal(false)}>
                <img src={image} alt='attachment' style={{
                    maxHeight: 600,
                }} />
            </Modal>
            <div className="Container">
                <div className="Details" style={{

                }}>
                    {Object.keys(selected).filter(el => !exception.includes(el))
                        .map(el =>
                            <LabeledText
                                label={el.length > 2 ? el.replace(/_/g, ' ') : el.toUpperCase()}
                                value={selected[el]}
                            />
                        )}
                </div>
                <div className="Photos">
                    <Button label="Edit" onClick={() => history.push(
                        url.split('/').slice(0, -1).join('/') + "/edit"
                    )} />
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