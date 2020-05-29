import React, { useCallback, useState } from 'react';

import LabeledText from '../../components/LabeledText';
import Button from '../../components/Button';
import Table from '../../components/Table';
import Filter from '../../components/Filter';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { months, dateFormatter, toSentenceCase } from '../../utils';
import { getBillingUnitItem, setSelected } from './slice';
import { FiPlus } from 'react-icons/fi';

const exception = [
    'created_on', 'modified_on', 'deleted',
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
    { Header: 'Month', accessor: row => months[row.month].label },
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

    const headers = useSelector(state => state.auth.headers);
    const { selected, loading, unit, refreshToggle } = useSelector(state => state.billing);

    let dispatch = useDispatch();
    let history = useHistory();
    let { path, url } = useRouteMatch();

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
                <div className="Photos">
                    <Button label="Edit" onClick={() => history.push(
                        url.split('/').slice(0, -1).join('/') + "/edit"
                    )} />
                </div>
            </div>
            <div className="Container" style={{
                marginTop: 16,
                flex: 1,
                flexDirection: 'column',
            }}>
                <Table
                    columns={columns}
                    data={unit.items}
                    loading={loading}
                    pageCount={unit.total_pages}
                    fetchData={useCallback((pageIndex, pageSize, search) => {
                        dispatch(getBillingUnitItem(headers, pageIndex, pageSize, search,
                            selected, status));
                        // eslint-disable-next-line react-hooks/exhaustive-deps
                    }, [dispatch, refreshToggle, headers, selected, status])}
                    filters={[
                        {
                            button: <Button key="Payment Status"
                                label={status ? toSentenceCase(status) : "Payment Status"}
                                selected={status}
                            />,
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
                                history.push(url + "/add");
                            }}
                        />
                    ]}
                />
            </div>
        </div>
    )
}

export default Component;