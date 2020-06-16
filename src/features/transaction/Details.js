import React from 'react';

import LabeledText from '../../components/LabeledText';
import Button from '../../components/Button';
import Table from '../../components/Table';
import { useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { toMoney, toSentenceCase } from '../../utils';

const exception = [
    'created_on', 'modified_on', 'deleted', 'addons', 'items'
];

const columnsProduct = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Name', accessor: 'item_name' },
    { Header: 'Type', accessor: row => toSentenceCase(row.item_type) },
    { Header: 'Base Price', accessor: 'base_price' },
    { Header: 'Admin Fee', accessor: row => toMoney(row.admin_fee) },
    { Header: 'Discount Code', accessor: 'discount_code' },
    { Header: 'Discount Fee', accessor: row => row.discount_price + '%' },
    { Header: 'PG Fee', accessor: row => row.pg_fee + '%' },
    { Header: 'Selling Price', accessor: row => toMoney(row.selling_price) },
]

function Component() {
    const {selected, loading} = useSelector(state => state.transaction);

    let history = useHistory();
    let { url } = useRouteMatch();

    const detailsPayment = Object.keys(selected).filter(el => !exception.includes(el))
        .filter(el => el.includes('payment'));

    const detailsPrice = Object.keys(selected).filter(el => !exception.includes(el))
        .filter(el => el.includes('price') || el.includes('charges') || el.includes('discount')
        || el.includes('tax') || el.includes('profit'));

    const details = Object.keys(selected).filter(el => !exception.includes(el))
    .filter(el => !detailsPayment.includes(el)).filter(el => !detailsPrice.includes(el))
    .filter(el => !el.includes('courier'));

    return (
        <div>
            <div style={{
                display: 'flex',
            }}>
                <div className="Container">
                    <div className="Details" style={{

                    }}>
                        {details
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
                <div style={{
                    flex: 1,
                    marginLeft: 16,
                }}>
                    <div className="Container" style={{
                    }}>
                        <div className="Details" style={{

                        }}>
                            {detailsPrice
                                .map(el =>
                                    <LabeledText
                                        key={el}
                                        label={el.length > 2 ? el.replace('_', ' ') : el.toUpperCase()}
                                        value={selected[el]}
                                    />
                                )}
                        </div>
                    </div>
                    <div className="Container" style={{
                        marginTop: 16,
                    }}>
                        <div className="Details" style={{

                        }}>
                            {detailsPayment
                                .map(el =>
                                    <LabeledText
                                        key={el}
                                        label={el.length > 2 ? el.replace('_', ' ') : el.toUpperCase()}
                                        value={selected[el]}
                                    />
                                )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="Container" style={{
                marginTop: 16,
                flex: 1,
                flexDirection: 'column',
            }}>
                <Table
                    columns={columnsProduct}
                    data={selected.items}
                    loading={loading}
                    pageCount={1}
                    // fetchData={fetchData}
                />
            </div>
        </div>
    )
}

export default Component;
