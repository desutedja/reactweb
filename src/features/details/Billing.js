import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';

import Detail from './components/Detail';
import Template from './components/Template';

import ThreeColumn from '../../components/ThreeColumn';
import Button from '../../components/Button';
import Row from '../../components/Row';
import Column from '../../components/Column';
import Table from '../../components/Table';
import { Card, CardTitle, CardBody } from 'reactstrap';
import Filter from '../../components/Filter';
import { dateTimeFormatterCell, toMoney, toEllipsis, toSentenceCase, dateFormatter } from '../../utils';
import { getBillingUnitItem, setSelectedItem, deleteBillingUnitItem } from '../slices/billing';
import { ListGroupItem, ListGroup } from 'reactstrap';
import Pill from '../../components/Pill';
import { FiClock, FiPlus } from 'react-icons/fi';
import BillingItem from '../../components/cells/BillingItem';
import moment from 'moment';

const details =
{
    '': ['resident_name', 'building_name', 'section_name', 'number'],
};


function Component({ view }) {
    let dispatch = useDispatch();
    let history = useHistory();
    let { url } = useRouteMatch();

    const [status, setStatus] = useState('');
    const [items, setItems] = useState([]);
    const [active, setActive] = useState(history.location.state?.month_active || 0);

    const { role } = useSelector(state => state.auth);

    const { selected, loading, unit, refreshToggle } = useSelector(state => state.billing);

    const columns = useMemo(() => {
        function isLate(payment, due_date, payment_date) {
            return payment === "paid" ? moment.utc(payment_date).isAfter(moment.utc(due_date)) :
                moment.utc().isAfter(moment.utc(due_date))
        }

        return [
            { Header: 'ID', accessor: 'id' },
            { Header: 'Name', accessor: row => 
                <BillingItem id={row.id} items={[row.name, <>{row.service_name} - {row.group === 'ipl' ? 'IPL' : 'Non-IPL'}</>]} /> },
            {
                Header: 'Total', accessor: row =>
                    <div style={{ display: 'block' }}>
                        <div>{toMoney(row.total)}</div>
                        {row.additional_charge_amount > 0 && <div>+ {toMoney(row.additional_charge_amount)}</div>}
                    </div>
            },
            { Header: 'Due Date', accessor: row => dateFormatter(row.due_date) },
            {
                Header: 'Ref Code', accessor: row => row.ref_code ?
                    <a class="Link" href={"/" + role + "/billing/unit/item/record/" + row.ref_code}>{toEllipsis(row.ref_code, 10)}</a> : '-'
            },
            {
                Header: 'Payment', accessor: row =>
                    (
                        row.payment_method === 'cash' ?
                            <Pill color="primary">Cash Paid</Pill> :
                            <Pill color={row.payment === "paid" ? "success" : "secondary"}>{toSentenceCase(row.payment)}</Pill>
                    )
            },
            {
                Header: 'Payment Date', accessor: row => row.payment_date ?
                    <div>
                        <div>{dateTimeFormatterCell(row.payment_date)}</div>
                        {isLate(row.payment, row.due_date, row.payment_date) &&
                            <div style={{ color: 'red' }}><FiClock /> Overdue Payment</div>}
                    </div>
                    : '-'
            },
        ]
    }, [role]);

    useEffect(() => {
        dispatch(getBillingUnitItem(0, 100, '',
            { id: selected.id, building_id: selected.building_id }, status));
    }, [dispatch, refreshToggle, selected, status])

    useEffect(() => {
        setItems([]);
        unit.items && unit.items.billing && unit.items.billing[active] && setItems(unit.items.billing[active].billing_item
            .filter(el => status === '' ? true : el.payment === status));
    }, [unit.items, active, status]);

    useEffect(() => {
        console.log(selected)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Template transparent
            pagetitle="Unit Billing Details"
            title={(role === "sa" ? toSentenceCase(selected.building_name) + ", " : "") +
                toSentenceCase(selected.section_type) + " " +
                toSentenceCase(selected.section_name) + " " + selected.number}
            loading={false}
            labels={[]}
            contents={[
                <div style={{
                    display: 'flex',
                    marginTop: 16,
                }}>
                    <Column style={{ flex: 2, display: 'block' }}>
                        <Card className="Container" style={{
                            boxShadow: 'none',
                            flexDirection: 'column',
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }} >
                                <h5> Billing Month </h5>
                            </div>
                            <ListGroup>
                                {unit?.items?.billing?.length > 0 ?
                                    unit?.items?.billing?.map((el, index) => <ListGroupItem
                                        style={{ cursor: "pointer" }}
                                        active={index === active}
                                        tag="b"
                                        onClick={() => setActive(index)}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <div>{el.billing_month}</div>
                                            <div>{el.billing_item.some(it => it.payment === "unpaid") ?
                                                <Pill color="light">Unpaid</Pill> : <Pill color="success">Paid</Pill>
                                            }</div>
                                        </div>
                                    </ListGroupItem>) : <div style={{ padding: "10px 0px" }} >No Billing Yet</div>}
                            </ListGroup>
                        </Card>
                    </Column>
                    <Column style={{ flex: 8 }}>
                        <Row>
                            <Card className="Container" style={{
                                flex: 4,
                                flexDirection: 'column',
                                marginRight: 16,
                                boxShadow: 'none',
                            }}>
                                <CardTitle>
                                        <>Billing Items {unit.items && unit.items.billing && unit.items.billing[active] ?
                                            "for " + unit.items.billing[active].billing_month : ""}</>
                                </CardTitle>
                                <Table
                                    columns={columns}
                                    data={items}
                                    loading={loading}
                                    pageCount={unit.total_pages}
                                    totalItems={items.length}
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
                                        <>{view ? null : <Button key="Add Billing" label="Add Billing" icon={<FiPlus />}
                                            onClick={() => {
                                                dispatch(setSelectedItem({}));
                                                history.push({
                                                    pathname:  url + "/add",
                                                    state: { 
                                                        year: parseInt(unit?.items?.billing[active].year),
                                                        month: parseInt(unit?.items?.billing[active].month),
                                                    }
                                                });
                                            }}
                                        />}</>
                                    ]}
                                    deleteSelection={(selectedRows, rows) => {
                                        Object.keys(selectedRows).map(el => dispatch(deleteBillingUnitItem(
                                            rows[el].original.id)));
                                    }}
                                />
                            </Card>
                        </Row>
                        <Row>
                            <Column style={{ display: 'block' }}>
                                <Card style={{
                                    marginLeft: 16,
                                    marginRight: 20,
                                    marginBottom: 20,
                                    flex: 2,
                                }}>
                                    <CardBody>
                                        <CardTitle>Unit Information</CardTitle>
                                        <Detail type="Billing" data={selected} labels={details} editable={false} />
                                    </CardBody>
                                </Card>
                            </Column>
                            <Column style={{ display: 'block' }}>
                                <Card style={{
                                    marginRight: 16,
                                    marginBottom: 20,
                                    flex: 8,
                                }}>
                                    <CardBody>
                                        <CardTitle>
                                            Summary {unit.items && unit.items.billing && unit.items.billing[active] ?
                                                "for " + unit.items.billing[active].billing_month : ""}
                                        </CardTitle>
                                        {(unit.items && unit.items.billing?.length > 0) ? <>
                                        <ThreeColumn second="Subtotal" third={toMoney(unit.items.billing[active].group_amount + 
                                            unit.items.billing[active].group_additional_charge)} />
                                            <ThreeColumn second={"Penalty (" + (unit.items.billing[active].group_penalty_percentage) + "%)"}
                                                third={<span style={{ color: 'red' }}>
                                                    {toMoney(unit.items.billing[active].group_penalty)}</span>} />
                                            <ThreeColumn second="Total"
                                                third={<h4 className="m-0">{toMoney(unit.items.billing[active].total_group_amount)}</h4>} />
                                        </> : "-"}
                                        {/* JSON.stringify(unit.items, null, 4) */}
                                    </CardBody>
                                </Card>
                            </Column>
                        </Row>
                    </Column>
                </div>
                ,
            ]}
        />
    )
}

export default Component;
