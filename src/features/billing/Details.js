import React, { useState, useEffect } from 'react';

import LabeledText from '../../components/LabeledText';
import Button from '../../components/Button';
import Table from '../../components/Table';
import Filter from '../../components/Filter';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { months, dateFormatter, toSentenceCase } from '../../utils';
import { getBillingUnitItem, getBillingUnitItemDetails, setSelectedUnit, deleteBillingUnitItem } from './slice';
import { FiPlus } from 'react-icons/fi';

const exception = [
    'created_on', 'modified_on', 'deleted', 'billing_item'
];

const columns = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Name', accessor: 'name' },
    { Header: 'Group', accessor: row => row.group === 'ipl' ? 'IPL' : 'Non-IPL' },
    // { Header: 'Remarks', accessor: 'remarks' },
    // { Header: 'Subtotal', accessor: 'subtotal' },
    // {
    //     Header: 'Tax', accessor: row => row.tax === 'percentage' ?
    //         (row.tax_value + '%') : row.tax_amount
    // },
    // { Header: 'Additional Charges', accessor: row => 0 },
    { Header: 'Total', accessor: 'total' },
    { Header: 'Month', accessor: row => months.find(el => el.value === row.month).label },
    { Header: 'Year', accessor: 'year' },
    { Header: 'Due Date', accessor: row => dateFormatter(row.due_date) },
    { Header: 'Payment', accessor: row => toSentenceCase(row.payment) },
    {
        Header: 'Payment Date', accessor: row => row.payment_date ? dateFormatter(row.payment_date)
            : '-'
    },
]

function Component() {
    const [status, setStatus] = useState('');
    const [items, setItems] = useState([]);
    const [active, setActive] = useState(0);

    const headers = useSelector(state => state.auth.headers);
    const { selected, loading, unit, refreshToggle } = useSelector(state => state.billing);

    let dispatch = useDispatch();
    let history = useHistory();
    let { url } = useRouteMatch();

    useEffect(() => {
        dispatch(getBillingUnitItem(headers, 0, 100, '',
            selected, status));
    }, [dispatch, refreshToggle, headers, selected, status])

    useEffect(() => {
        unit.items[active] && setItems(unit.items[active].billing_item);
    }, [unit.items, active])

    return (
        <div>
            <div className="Container">
                <div className="Details" style={{

                }}>
                    {Object.keys(selected).filter(el => !exception.includes(el))
                        .map(el =>
                            <LabeledText
                                key={el}
                                label={el.length > 2 ? el.replace('_', ' ') : el.toUpperCase()}
                                value={selected[el]}
                            />
                        )}
                </div>
                {/* <div className="Photos">
                    <Button label="Edit" onClick={() => history.push(
                        url.split('/').slice(0, -1).join('/') + "/edit"
                    )} />
                </div> */}
            </div>
            <div style={{
                display: 'flex',
                marginTop: 16,
            }}>
                {unit.items.length > 0 && <div className="Container" style={{
                    flexDirection: 'column',
                    marginRight: 16,
                }}>
                    {unit.items.map((el, index) => <div
                        className={index === active ? "GroupActive" : "Group"}
                        onClick={() => setActive(index)}
                    >
                        {el.billing_month}
                    </div>)}
                </div>}
                <div className="Container" style={{
                    flex: 3,
                    flexDirection: 'column',
                }}>
                    <Table
                        columns={columns}
                        data={items}
                        loading={loading}
                        pageCount={unit.total_pages}
                        // fetchData={}
                        filters={[
                            {
                                label: <p>{"Status: " + (status ? toSentenceCase(status) : "All")}</p>,
                                hidex: status === '',
                                delete: () => setStatus(''),
                                component: (toggleModal) =>
                                    <>
                                        <Filter
                                            data={[
                                                { label: 'Paid', value: 'paid' },
                                                { label: 'Unpaid', value: 'unpaid' },
                                            ]}
                                            onClick={(el) => {
                                                setStatus(el.value);
                                                toggleModal(false);
                                            }}
                                            onClickAll={() => {
                                                setStatus('');
                                                toggleModal(false);
                                            }}
                                        />
                                    </>
                            },
                        ]}
                        actions={[
                            <Button key="Add" label="Add" icon={<FiPlus />}
                                onClick={() => {
                                    dispatch(setSelectedUnit({}));
                                    history.push(url + "/add");
                                }}
                            />
                        ]}
                        onClickDetails={row => {
                            dispatch(getBillingUnitItemDetails(row, headers, history, url))
                        }}
                        deleteSelection={(selectedRows, rows) => {
                            Object.keys(selectedRows).map(el => dispatch(deleteBillingUnitItem(
                                rows[el].original.id, headers)));
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default Component;