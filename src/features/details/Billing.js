import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory, useRouteMatch } from 'react-router-dom';

import Detail from './components/Detail';
import Template from './components/Template';

import ThreeColumn from '../../components/ThreeColumn';
import Button from '../../components/Button';
import Row from '../../components/Row';
import Column from '../../components/Column';
import Table from '../../components/Table';
import { Card, CardTitle, CardBody } from 'reactstrap';
import Filter from '../../components/Filter';
import { months, dateTimeFormatterCell, toMoney, toEllipsis, toSentenceCase, dateFormatter } from '../../utils';
import { getBillingUnitDetails, getBillingUnitItem, getBillingUnitItemDetails, setSelectedUnit, deleteBillingUnitItem } from '../slices/billing';
import { ListGroupItem, ListGroup } from 'reactstrap';
import Pill from '../../components/Pill';
import { FiPlus } from 'react-icons/fi';
import BillingItem from '../../components/cells/BillingItem';

const details =
{
    '': ['resident_name', 'building_name', 'section_name', 'number'],
};


function Component() {
    const [status, setStatus] = useState('');
    const [items, setItems] = useState([]);
    const [active, setActive] = useState(0);

    const { role } = useSelector(state => state.auth);

    const { selected, loading, unit, refreshToggle } = useSelector(state => state.billing);

    let dispatch = useDispatch();
    let history = useHistory();
    let { url } = useRouteMatch();

    const columns = useMemo(() => ([
        { Header: 'ID', accessor: 'id' },
        { Header: 'Name', accessor: row => <BillingItem data={row} items={[row.name]} />},
        { Header: 'Group', accessor: row => row.group === 'ipl' ? 'IPL' : 'Non-IPL' },
        { Header: 'Total', accessor: row => toMoney(row.total) },
        { Header: 'Month', accessor: row => <div style={{ display: 'block' }}>
                <div>{months.find(el => el.value === row.month).label}</div>
                <div>{row.year}</div>
            </div>},
        { Header: 'Due Date', accessor: row => dateFormatter(row.due_date) },
        { Header: 'Ref Code', accessor: row => row.ref_code ? 
        <a class="Link" href={"/" + role + "/billing/unit/item/record/" + row.ref_code}>{toEllipsis(row.ref_code, 10)}</a> : '-'
        },
        { Header: 'Payment', accessor: row => 
            (
                row.payment_method === 'cash' ? 
                    <Pill color="primary">Cash Paid</Pill> :
                <Pill color={row.payment === "paid" ? "success": "secondary"}>{toSentenceCase(row.payment)}</Pill> 
            )
        },
        {
            Header: 'Payment Date', accessor: row => row.payment_date ? dateTimeFormatterCell(row.payment_date)
                : '-'
        },
    ]), [ role ]);

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
        <Template transparent
            pagetitle="Unit Billing Details"
            title={(role === "sa" ? toSentenceCase(selected.building_name) + ", " : "" ) +
                   toSentenceCase(selected.section_type) + " " + 
                   toSentenceCase(selected.section_name) + " " + selected.number}
            loading={false}
            labels={[]}
            contents={[
                <div style={{
                    display: 'flex',
                    marginTop: 16,
                }}>
                    <Column style={{ flex: 2 }}>
                        <Card className="Container" style={{
                            boxShadow: 'none',
                            flexDirection: 'column',
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }} >
                                <h5> Billing Month </h5>
                                <Button key="Add Billing" label="Add Billing" icon={<FiPlus />}
                                    onClick={() => {
                                        dispatch(setSelectedUnit({}));
                                        history.push(url + "/add");
                                    }}
                                />
                            </div>
                            <ListGroup>
                                {unit.items.length > 0 ? 
                                unit.items.map((el, index) => <ListGroupItem 
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
                                    <>Billing Items {unit.items[active] ? "for " + unit.items[active].billing_month : ""}</>
                                ]}
                                onClickDetails={row => {
                                    dispatch(getBillingUnitItemDetails(row, history, url))
                                }}
                                deleteSelection={(selectedRows, rows) => {
                                    Object.keys(selectedRows).map(el => dispatch(deleteBillingUnitItem(
                                        rows[el].original.id)));
                                }}
                            />
                        </Card>
                    </Row>
                    <Row>
                        <Column>
                            <Card style={{
                                marginLeft: 16,
                                marginRight: 20,
                                marginBottom: 20,
                                flex: 2,
                            }}>
                                <CardBody>
                                    <CardTitle>Unit Information</CardTitle>
                                    <Detail type="Billing" data={selected} labels={details} editable={false} />,
                                </CardBody>
                            </Card>
                        </Column>
                        <Column>
                            <Card style={{
                                marginRight: 16,
                                marginBottom: 20,
                                flex: 8,
                            }}>
                                <CardBody>
                                    <CardTitle>Summary {unit.items[active] ? "for " + unit.items[active].billing_month : ""}</CardTitle>
                                    <ThreeColumn second="Total Paid" third="Rp 123.123.123" />
                                    <ThreeColumn second="Total Unpaid" third="Rp 123.123.123" />
                                    <ThreeColumn second="Total Penalty" third="Rp 123.123.123" />
                                    <ThreeColumn second="Total" third={<h4>{toMoney(items.reduce((sum, el) => sum + el.total, 0))}</h4>}/>
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
