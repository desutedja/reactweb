import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Modal from '../../../components/Modal';
import Input from '../../../components/Input';
import Button from '../../../components/Button';

import Detail from '../components/Detail';
import Template from '../components/Template';
import { patchAdminFee } from '../../slices/product';

const labels = {
    'Information': [
        "id",
        "name",
        "item_type",
        "description",
        "stock",
        "promoted",
        "promoted_until",
    ],
    "Specification": [
        "length",
        "width",
        "height",
        "weight",
        "measurement_standard",
        "measurement_unit",
    ],
    "Pricing": [
        "base_price",
        "selling_price",
        "admin_fee",
        "pg_fee",
        "delivery_fee",
    ],
};

function Component() {
    const [modal, setModal] = useState(false);
    const [image, setImage] = useState('');

    const [modalFee, setModalFee] = useState(false);
    const [adminFee, setAdminFee] = useState('');
    const [discFee, setDiscFee] = useState('');

    
    const { selected } = useSelector(state => state.product);

    let dispatch = useDispatch();

    return (
        <>
            <Modal disableFooter disableHeader isOpen={modal} toggle={() => setModal(false)}>
                <img src={image} alt='attachment' style={{
                    maxHeight: 600,
                    maxWidth: '100%',
                    objectFit: 'cover',
                }} />
            </Modal>
            <Modal title="Adjust Fees" okLabel={"Set Fees"} isOpen={modalFee} disableHeader={true} toggle={() => { setModalFee(false); setAdminFee(""); setDiscFee(""); }}
                onClick={() => {
                    dispatch(patchAdminFee( {
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
                        <Input label="Discount" type="number" inputValue={discFee !== "" ? discFee : selected.discount_fee}
                            setInputValue={setDiscFee} />
                    </div>
                    <div style={{
                        display: 'flex',
                        marginTop: 16,
                    }}>
                    </div>
                </form>
            </Modal>
            <Template
                image={selected.thumbnails}
                title={selected.name}
                merchant={"Merchant Name"}
                labels={["Details", "Images"]}
                contents={[
                    <Detail data={selected} labels={labels} editable={false}
                    renderButtons={() => [
                        <Button label="Adjust Fees & Discount" onClick={() => setModalFee(true)} />,
                        <Button label="Take Down Product" onClick={() => {}} />,
                    ]}
                    />,
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
                ]}
            />
        </>
    )
}

export default Component;
