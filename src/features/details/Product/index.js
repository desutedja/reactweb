import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Modal from '../../../components/Modal';
import Input from '../../../components/Input';
import Button from '../../../components/Button';

import Detail from '../components/Detail';
import Template from '../components/Template';
import { patchAdminFee, setSelected, refresh } from '../../slices/product';
import { toMoney } from '../../../utils.js';
import { useParams } from 'react-router-dom';
import { get, patch, setInfo } from '../../slice';
import { endpointMerchant } from '../../../settings';

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
        { label: "base_price", lfmt: () => "Base Price", vfmt: (val) => toMoney(val) },
        { label: "selling_price", lfmt: () => "Selling Price", vfmt: (val) => toMoney(val) },
        { label: "total_selling_price", lfmt: (el) => "Display Price", vfmt: (val) => toMoney(val) },
        { label: "admin_fee", lfmt: (el) => "Admin Fee", vfmt: (val) => val + "%" },
        { label: "discount_fee", lfmt: (el) => "Discount", vfmt: (val) => val + "%" },
    ],
};

function Component() {

    const { product } = useSelector(state => state);
    const data = product.selected;
    // const [data, setData] = useState(product.selected || {});
    
    const [modal, setModal] = useState(false);
    const [image, setImage] = useState('');

    const [modalFee, setModalFee] = useState(false);
    const [adminFee, setAdminFee] = useState('');
    const [discFee, setDiscFee] = useState('');

    const [calculatedPrice, setCalculatedPrice] = useState(0);

    let dispatch = useDispatch();
    let { id } = useParams();

    useEffect(() => {
        dispatch(get(endpointMerchant + '/admin/items?id=' + id, res => {
            // setData(res.data.data);
            dispatch(setSelected(res.data.data));
        }))
    }, [id, dispatch, product.refreshToggle])

    useEffect(() => {
        (discFee !== "" || adminFee !== "") && (setCalculatedPrice(
            <span style={{ color: "red" }}>{toMoney(data.selling_price +
                Math.ceil(data.selling_price * (adminFee) / 100) -
                Math.ceil(data.selling_price * (discFee / 100)))}
            </span>
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
                        item_id: data.id,
                        merchant_id: data.merchant_id,
                        admin_fee: parseInt(adminFee),
                        pg_fee: data.pg_fee,
                        discount_fee: parseInt(discFee),
                        delivery_fee: data.delivery_fee,
                    }, [data]));
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
                        <h5>Selling Price: {toMoney(data.selling_price)}</h5>
                        <h5>Display Price: {calculatedPrice}</h5>
                    </div>
                </form>
            </Modal>
            <Template
                image={data.thumbnails}
                title={data.name}
                merchant={data.merchant_name}
                loading={!data.id}
                labels={["Details", "Images"]}
                contents={[
                    <Detail data={data} labels={labels} editable={false}
                        renderButtons={() => [
                            <Button label="Adjust Fees & Discount" onClick={() => {
                                setModalFee(true);
                                setAdminFee(data.admin_fee);
                                setDiscFee(data.discount_fee);
                            }} />,
                            <Button disabled={data.status === 'blocked'} label="Take Down Product" onClick={() => {
                                const dataInput = {
                                    merchant_id: data.merchant_id,
                                    item_id: data.id,
                                    status: 'blocked'
                                }
                                dispatch(patch(endpointMerchant + '/admin/items/status', dataInput,
                                    res => {
                                        dispatch(setInfo({
                                            color: 'success',
                                            message: 'Product has been taken down.'
                                        }));
                                        dispatch(refresh());
                                    }
                                ))
                            }} />,
                        ]}
                    />,
                    <div style={{
                        display: 'flex',
                        marginTop: 16,
                    }}>
                        {data.images?.map((el, id) =>
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
