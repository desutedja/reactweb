import React, { useState, useEffect } from 'react';

import Detail from './components/Detail';
import Template from './components/Template';

import Modal from '../../components/Modal';
import Table from '../../components/Table';
import Button from '../../components/Button';
import { useSelector, useDispatch } from 'react-redux';
import { payByCash, getBillingUnitItem } from '../slices/billing';
import { Formik, Form } from 'formik';
import Input from '../form/input';
import SubmitButton from '../form/components/SubmitButton';
import { post, get, setConfirmDelete } from '../slice';
import { endpointBilling } from '../../settings';
import { toMoney, dateTimeFormatter } from '../../utils';
import { FiPlus } from 'react-icons/fi';

const details =
{
    'Information': [
        'created_on',
        'ref_code',
        'name',
        'group',
        'service',
        'previous_usage',
        'recent_usage',
        {label: 'price_unit', vfmt: v => toMoney(v)},
        'denom_unit',
        'month',
        'year',
        'due_date',
        'payment',
        'payment_date',
        {label: 'subtotal', vfmt: v => toMoney(v)},
        'tax',
        {label: 'tax_amount', vfmt: v => v ? toMoney(v) : '-'},
        {label: 'tax_value',  vfmt: v => v ? toMoney(v) : '-'},
        {label: 'total', vfmt: v => toMoney(v)},
        {label: 'additional_charge_amount', vfmt: v => toMoney(v)},
        {label: 'total_amount', vfmt: v => toMoney(v)},
    ],
};

const columns = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Created On', accessor: row => dateTimeFormatter(row.created_on) },
    { Header: 'Charge Name', accessor: 'charge_name' },
    { Header: 'Charge Description', accessor: 'charge_description' },
    { Header: 'Charge Price', accessor: row => toMoney(row.charge_price) },
]

function Component() {
    const [modal, setModal] = useState(false);
    const [toggle, setToggle] = useState(false);

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalItems, setTotalItems] = useState('');
    const [pageCount, setPageCount] = useState('');

    const { unit } = useSelector(state => state.billing);

    let dispatch = useDispatch();

    useEffect(() => {
        setLoading(true);
        dispatch(get(endpointBilling + '/management/billing/additional-charge?id=' +
            unit.selected.id, res => {
                setData(res.data.data);
                setTotalItems(res.data.data.length);
                setPageCount(1);
                setLoading(false);
            }))
    }, [dispatch, unit.selected.id, toggle])

    return (
        <>
            <Modal disableFooter isOpen={modal} toggle={() => setModal(false)}
                title="Add Additional Charge"
            >
                <Formik
                    initialValues={{
                        "charge_name": '',
                        "charge_description": '',
                        "charge_price": '',
                    }}
                    onSubmit={(values) => {
                        const data = {
                            ...values,
                            billing_id: unit.selected.id,
                            charge_price: parseInt(values.charge_price, 10),
                        }

                        console.log(data);

                        dispatch(post(endpointBilling + '/management/billing/additional-charge', data, res => {
                            setModal(false);
                            setToggle(!toggle);
                        }))
                    }}
                >
                    {props => {
                        const { errors } = props;

                        return (
                            <Form className="Form">
                                <Input {...props} label="Charge Name" />
                                <Input {...props} label="Charge Description" />
                                <Input {...props} label="Charge Price" />
                                <SubmitButton errors={errors} />
                            </Form>
                        )
                    }}
                </Formik>
            </Modal>
            <Template
                loading={false}
                labels={["Details", "Additional Charges"]}
                contents={[
                    <Detail type="Billing" data={unit.selected} labels={details}
                        editable={unit.selected.payment !== 'paid'}
                        renderButtons={() => ([
                            unit.selected.payment !== "paid" && <Button label="Set as Paid" onClick={() => {
                                dispatch(payByCash({
                                    "id": unit.selected.id,
                                    "total": unit.selected.total,
                                    "penalty_amount": unit.selected.penalty_amount,
                                    "total_payment": unit.selected.total_payment,
                                    "additional_charge_amount": unit.selected.additional_charge_amount,
                                }));
                            }} />
                        ])}
                    />,
                    <Table
                        columns={columns}
                        loading={loading}
                        totalItems={totalItems}
                        pageCount={pageCount}
                        data={data}
                        actions={[
                            unit.selected.payment !== 'paid' && <Button icon={<FiPlus />}
                                label="Add Additional Charge" onClick={() => {
                                    setModal(true);
                                }} />,
                        ]}
                        onClickDelete={row => {
                            dispatch(setConfirmDelete("Are you sure to delete this item?",
                                () => {
                                    dispatch(post(endpointBilling
                                        + '/management/billing/additional-charge/delete', {
                                        deleted: [row.id],
                                    }, res => {
                                        setToggle(!toggle)
                                    }))
                                }
                            ));
                        }}
                    />
                ]}
            />
        </>
    )
}

export default Component;