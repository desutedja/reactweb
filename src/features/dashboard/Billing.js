import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import AnimatedNumber from "animated-number-react";

import { get, toMoney } from '../../utils';
import { endpointBilling, endpointManagement } from '../../settings';

import './style.css';

const formatValue = (value) => value.toFixed(0);
const formatValuetoMoney = (value) => toMoney(value.toFixed(0));

function Component() {
    const [billingData, setBillingData] = useState({});
    const [staffData, setStaffData] = useState({});

    const headers = useSelector(state => state.auth.headers);

    useEffect(() => {
        get(endpointBilling + '/management/billing/statistic', headers, res => {
            setBillingData(res.data.data);
        })
    }, [headers]);

    useEffect(() => {
        get(endpointManagement + '/admin/staff/statistics', headers, res => {
            setStaffData(res.data.data);
        })
    }, [headers]);

    return (
        <>
            <div className="Container" style={{
                flexDirection: 'column',
                padding: 0,
            }}>
                <div style={{
                    padding: 16,
                    borderBottom: '1px solid #f3f3fa',
                }}>
                    <h5>User Count</h5>
                </div>
                <div style={{
                    display: 'flex'
                }}>
                    <div style={{
                        flex: 1,
                        padding: 16,
                        borderRight: '1px solid #f3f3fa',
                    }}>
                        <AnimatedNumber className="BigNumber" value={staffData.num_of_building}
                            formatValue={formatValue}
                        />
                        <p>Resident</p>
                    </div>
                    <div style={{
                        flex: 1,
                        padding: 16,
                        borderRight: '1px solid #f3f3fa',
                    }}>
                        <AnimatedNumber className="BigNumber" value={staffData.num_of_unit}
                            formatValue={formatValue}
                        />
                        <p>Technician</p>
                    </div>
                    <div style={{
                        flex: 1,
                        padding: 16,
                        borderRight: '1px solid #f3f3fa',
                    }}>
                        <AnimatedNumber className="BigNumber" value={staffData.num_of_unit
                            / staffData.num_of_building}
                            formatValue={formatValue}
                        />
                        <p>Security</p>
                    </div>
                    <div style={{
                        flex: 1,
                        padding: 16,
                        borderRight: '1px solid #f3f3fa',
                    }}>
                        <AnimatedNumber className="BigNumber" value={staffData.num_of_unit
                            / staffData.num_of_building}
                            formatValue={formatValue}
                        />
                        <p>Merchant</p>
                    </div>
                    <div style={{
                        flex: 1,
                        padding: 16,
                        borderRight: '1px solid #f3f3fa',
                    }}>
                        <AnimatedNumber className="BigNumber" value={staffData.num_of_unit
                            / staffData.num_of_building}
                            formatValue={formatValue}
                        />
                        <p>Courier</p>
                    </div>
                    <div style={{
                        flex: 1,
                        padding: 16,
                        borderRight: '1px solid #f3f3fa',
                    }}>
                        <AnimatedNumber className="BigNumber" value={staffData.num_of_unit
                            / staffData.num_of_building}
                            formatValue={formatValue}
                        />
                        <p>Building Manager</p>
                    </div>
                    <div style={{
                        flex: 1,
                        padding: 16,
                        borderRight: '1px solid #f3f3fa',
                    }}>
                        <AnimatedNumber className="BigNumber" value={staffData.num_of_unit
                            / staffData.num_of_building}
                            formatValue={formatValue}
                        />
                        <p>General Manager</p>
                    </div>
                </div>
            </div>
            <div className="Row">
                <div className="Container" style={{
                    padding: 0
                }}>
                    <div style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-evenly',
                        borderRight: '1px solid #f3f3fa',
                        padding: 16,
                    }}>
                        <div>Total Building</div>
                        <AnimatedNumber className="BigNumber" value={staffData.num_of_building}
                            formatValue={formatValue}
                        />
                    </div>
                    <div style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-evenly',
                        borderRight: '1px solid #f3f3fa',
                        padding: 16,
                    }}>
                        <div>Total Unit</div>
                        <AnimatedNumber className="BigNumber" value={staffData.num_of_unit}
                            formatValue={formatValue}
                        />
                    </div>
                    <div style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-evenly',
                        borderRight: '1px solid #f3f3fa',
                        padding: 16,
                    }}>
                        <div>Average Unit</div>
                        <AnimatedNumber className="BigNumber" value={staffData.num_of_unit
                            / staffData.num_of_building}
                            formatValue={formatValue}
                        />
                    </div>
                </div>
                <div className="Container" style={{
                    marginLeft: 16,
                }}>
                    <div style={{
                        flex: 1,
                        borderRight: '1px solid #f3f3fa',
                    }}>
                        <div style={{
                            flex: 1,
                            padding: 16,
                        }}>
                            <div>Paid Amount</div>
                            <AnimatedNumber className="BigNumber" value={billingData.total_paid_amount}
                                formatValue={formatValuetoMoney}
                            />
                        </div>
                        <div style={{
                            flex: 1,
                            padding: 16,
                        }}>
                            <div>Settled Amount</div>
                            <AnimatedNumber className="BigNumber" value={billingData.total_settle_amount}
                                formatValue={formatValuetoMoney}
                            />
                        </div>
                        <div style={{
                            flex: 1,
                            padding: 16,
                        }}>
                            <div>Disbursed Amount</div>
                            <AnimatedNumber className="BigNumber" value={billingData.total_disburse_amount}
                                formatValue={formatValuetoMoney}
                            />
                        </div>
                    </div>
                    <div style={{
                        flex: 1,
                    }}>
                        <div style={{
                            flex: 1,
                            padding: 16,
                        }}>
                            <div>Unpaid Amount</div>
                            <AnimatedNumber className="BigNumber" value={billingData.total_unpaid_amount}
                                formatValue={formatValuetoMoney}
                            />
                        </div>
                        <div style={{
                            flex: 1,
                            padding: 16,
                        }}>
                            <div>Unsettled Amount</div>
                            <AnimatedNumber className="BigNumber" value={billingData.total_unsettled_amount}
                                formatValue={formatValuetoMoney}
                            />
                        </div>
                        <div style={{
                            flex: 1,
                            padding: 16,
                        }}>
                            <div>Undisbursed Amount</div>
                            <AnimatedNumber className="BigNumber" value={billingData.total_undisburse_amount}
                                formatValue={formatValuetoMoney}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Component;