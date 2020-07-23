import React, { useState, useEffect } from 'react';

import Detail from './components/Detail';
import Template from './components/Template';

import Button from '../../components/Button';
import Table from '../../components/Table';
import Filter from '../../components/Filter';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { months, dateFormatter, toSentenceCase } from '../../utils';
import { getBillingUnitItem, getBillingUnitItemDetails, setSelectedUnit, deleteBillingUnitItem } from '../slices/billing';
import { FiPlus } from 'react-icons/fi';
import BillingItem from '../../components/cells/BillingItem';

const details =
{
    'Information': ['id', 'created_on', 'resident_name'],
    'Unit': ['building_name', 'code_name', 'section_type', 'section_name', 'number']
};

const columns = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Name', accessor: row => <BillingItem data={row} items={[row.name]} />},
    { Header: 'Group', accessor: row => row.group === 'ipl' ? 'IPL' : 'Non-IPL' },
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

    const { selected, loading, unit, refreshToggle } = useSelector(state => state.billing);

    let dispatch = useDispatch();
    let history = useHistory();
    let { url } = useRouteMatch();

    useEffect(() => {
        dispatch(getBillingUnitItem(0, 100, '',
            selected, status));
    }, [dispatch, refreshToggle, selected, status])

    useEffect(() => {
        setItems([]);
        unit.items[active] && setItems(unit.items[active].billing_item
            .filter(el => status === '' ? true : el.payment === status));
    }, [unit.items, active, status]);

    useEffect(() => {
        console.log(selected)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Template
            loading={false}
            labels={["Billing List", "Unit Information"]}
            contents={[
                <div style={{
                    display: 'flex',
                    marginTop: 16,
                }}>
                    {unit.items.length > 0 && <div className="Container" style={{
                        flexDirection: 'column',
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
                        marginRight: 16,
                    }}>
                        <Table
                            columns={columns}
                            data={items}
                            loading={loading}
                            pageCount={unit.total_pages}
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
                                <Button key="Add Billing" label="Add Billing" icon={<FiPlus />}
                                    onClick={() => {
                                        dispatch(setSelectedUnit({}));
                                        history.push(url + "/add");
                                    }}
                                />
                            ]}
                            onClickDetails={row => {
                                dispatch(getBillingUnitItemDetails(row, history, url))
                            }}
                            deleteSelection={(selectedRows, rows) => {
                                Object.keys(selectedRows).map(el => dispatch(deleteBillingUnitItem(
                                    rows[el].original.id)));
                            }}
                        />
                    </div>
                </div>,
                <Detail type="Billing" data={selected} labels={details} editable={false} />,
            ]}
        />
    )
}

export default Component;
