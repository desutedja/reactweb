import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Modal from '../../../components/Modal';
import Input from '../../../components/Input';
import Button from '../../../components/Button';

import Detail from '../components/Detail';
import Template from '../components/Template';
import { patchAdminFee } from '../../slices/product';
import { toMoney } from '../../../utils.js';

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
        { label: "base_price", labelFormatter: () => "Base Price", valueFormatter: (val) => toMoney(val) },
        { label: "selling_price", labelFormatter: () => "Selling Price", valueFormatter: (val) => toMoney(val) },
        { label: "total_selling_price", labelFormatter: (el) => "Display Price", valueFormatter: (val) => toMoney(val) },
        { label: "admin_fee", labelFormatter: (el) => "Admin Fee", valueFormatter: (val) => val + "%" },
        { label: "pg_fee", labelFormatter: (el) => "PG Markup", valueFormatter: (val) => val + "%" },
        { label: "discount_fee", labelFormatter: (el) => "Discount", valueFormatter: (val) => val + "%" },
    ],
};

function Component() {
    const [modal, setModal] = useState(false);
    const [image, setImage] = useState('');

    const [modalFee, setModalFee] = useState(false);
    const [adminFee, setAdminFee] = useState('');
    const [discFee, setDiscFee] = useState('');

    const [calculatedPrice, setCalculatedPrice] = useState(0);

    const {
        selected,
        // refresh
    } = useSelector(state => state.product);

    let dispatch = useDispatch();

    useEffect(() => {
        (discFee !== "" || adminFee !== "") && (setCalculatedPrice(
            <span style={{ color: "red" }}>{toMoney(selected.selling_price + Math.ceil(selected.selling_price * (adminFee) / 100) - Math.ceil(selected.selling_price * (discFee / 100)))}</span>
        ));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [discFee, adminFee]);

    return (
        <>
            <Modal disableFooter disableHeader isOpen={modal} toggle={() => setModal(false)}>
                <img src={image} alt='attachment' style={{
                    maxHeight: 600,
                    maxWidth: '100%',
                    objectFit: 'cover',
                }} />
            </Modal>
            <Modal title="Adjust Fees"
                okLabel={"Set Fees"} isOpen={modalFee}
                toggle={() => {
                    setModalFee(false);
                    setAdminFee("");
                    setDiscFee("");
                }}
                onClick={() => {
                    dispatch(patchAdminFee({
                        item_id: selected.id,
                        merchant_id: selected.merchant_id,
                        admin_fee: parseInt(adminFee),
                        pg_fee: selected.pg_fee,
                        discount_fee: parseInt(discFee),
                        delivery_fee: selected.delivery_fee,
                    }, [selected]));
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
                        <Input label="Admin Fee" type="text" inputValue={adminFee} addons={"%"}
                            setInputValue={setAdminFee} />
                        <Input label="Discount" type="text" inputValue={discFee} addons={"%"}
                            setInputValue={setDiscFee} />
                    </div>
                    <div style={{
                        display: 'block',
                        marginTop: 16,
                    }}>
                        <hr />
                        <h5>Selling Price: {toMoney(selected.selling_price)}</h5>
                        <h5>Display Price: {calculatedPrice}</h5>
                    </div>
                </form>
            </Modal>
            <Template
                image={selected.thumbnails}
                title={selected.name}
                merchant={selected.merchant_name}
                labels={["Details", "Images"]}
                contents={[
                    <Detail data={selected} labels={labels} editable={false}
                        renderButtons={() => [
                            <Button label="Adjust Fees & Discount" onClick={() => {
                                setModalFee(true);
                                setAdminFee(selected.admin_fee);
                                setDiscFee(selected.discount_fee);
                            }} />,
                            <Button label="Take Down Product" onClick={() => { }} />,
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
