import React, { useMemo, useState, useEffect } from 'react';
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

function Component({ view }) {
    const { product } = useSelector(state => state);
    const data = product.selected;
    // const [data, setData] = useState(product.selected || {});
    
    const [modal, setModal] = useState(false);
    const [image, setImage] = useState('');

    const [modalFee, setModalFee] = useState(false);
    const [adminFee, setAdminFee] = useState('');
    const [discFee, setDiscFee] = useState('');

    const [calculatedPrice, setCalculatedPrice] = useState(0);

    const [confirmChangeStatus, setConfirmChangeStatus] = useState(false);

    let dispatch = useDispatch();
    let { id } = useParams();

    const labels = useMemo(() => ({
        'Information': [
            "id",
            "name",
            "item_type",
            "description",
            "stock",
            //"promoted",
            //"promoted_until",
        ],
        "Specification": [
            { label: "measurement_standard", lfmt: () => "Measurement Type", 
                vfmt: (v) => v === "yes" ? "Standard Measurement" : "Nonstandard Measurement" },
            { disabled: data.measurement_standard === "no", label: "length", lfmt: () => "Dimension", vfmt: () =>
              data.length + " cm x " + data.width + " cm x " + data.height + " cm" },
            { disabled: data.measurement_standard === "no", label: "weight", lfmt: () => "Weight", 
                vfmt: (v) => (v + " gram") },
            { disabled: data.measurement_standard === "yes", lfmt: () => "Unit of Measurement", vfmt: (v) => v,
                label: "measurement_unit" },
        ],
        "Pricing": [
            { label: "base_price", lfmt: () => "Base Price", vfmt: (val) => toMoney(val) },
            { label: "selling_price", lfmt: () => "Selling Price", vfmt: (val) => toMoney(val) },
            { label: "total_selling_price", lfmt: (el) => "Display Price", vfmt: (val) => toMoney(val) },
            { label: "admin_fee", lfmt: (el) => "Admin Fee", vfmt: (val) => val + "%" },
            { label: "discount_fee", lfmt: (el) => "Discount", vfmt: (val) => val + "%" },
        ],
    }), [ data ]);

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
            <Modal 
                isOpen={confirmChangeStatus}
                disableHeader={true}
                onClick={ () => {
                    const dataInput = {
                        merchant_id: data.merchant_id,
                        item_id: data.id,
                        status: data.status === 'blocked' ? 'active' : 'blocked',
                    }
                    dispatch(patch(endpointMerchant + '/admin/items/status', dataInput,
                        res => {
                            dispatch(setInfo({
                                color: 'success',
                                message: 'Product has been ' + (res.data.data.status === 'blocked' ? 'blocked' : 'unblocked'),
                            }));
                            dispatch(refresh());
                        }
                    ))
                    setConfirmChangeStatus(false);
                }}
                toggle={() => setConfirmChangeStatus(false)}
                okLabel={"Confirm"}
                cancelLabel={"Cancel"}
            >
                Are you sure you want to set product <b>{data.name}</b> as {data.status === "blocked" ? "unblocked" : "blocked"}?
            </Modal>
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
                    <Detail view={view} data={data} labels={labels} editable={false}
                        renderButtons={() => [
                            <Button label="Adjust Fees & Discount" onClick={() => {
                                setModalFee(true);
                                setAdminFee(data.admin_fee);
                                setDiscFee(data.discount_fee);
                            }} />,
                        <Button label={data.status === 'blocked' ? "Unblock Product" : "Block Product"} 
                            color={data.status === 'blocked' ? 'success' : 'danger'}
                            onClick={() => 
                                setConfirmChangeStatus(true)
                            } />,
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
