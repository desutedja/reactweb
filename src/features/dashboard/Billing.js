import React, { useEffect, useState } from 'react';
import AnimatedNumber from "animated-number-react";

import { FiUsers, FiBriefcase } from 'react-icons/fi';
import { FaTools, FaBoxOpen } from 'react-icons/fa';
import { MdSecurity } from 'react-icons/md';
import { RiStore2Line, RiBuilding2Line } from 'react-icons/ri';

import { toMoney } from '../../utils';
import { endpointBilling, endpointManagement } from '../../settings';

import './style.css';
import { useDispatch } from 'react-redux';
import { get } from '../slice';

const formatValue = (value) => value.toFixed(0);
const formatValuetoMoney = (value) => toMoney(value.toFixed(0));

function Component() {
    const [billingData, setBillingData] = useState({});
    const [staffData, setStaffData] = useState({});

    let dispatch = useDispatch();

    useEffect(() => {
        dispatch(get(endpointBilling + '/management/billing/statistic',  res => {
            setBillingData(res.data.data);
        }))
    }, [dispatch]);

    useEffect(() => {
        dispatch(get(endpointManagement + '/admin/staff/statistics',  res => {
            setStaffData(res.data.data);
        }))
    }, [dispatch]);

    return (
        <>
            <div className="" style={{
                marginRight: 0,
                flexDirection: 'column',
                padding: 0,
            }}>
                <div className="row no-gutters">
                    <div className="Container col-12 col-md-3 col-lg px-3 align-items-center color-1">
                        <FiUsers className="h1 mr-4 my-0" />
                        <div style={{
                            flex: 1,
                            // padding: 16,
                            // borderRight: '1px solid #f3f3fa',
                        }}>
                            {/* <FiUsers className="h3 mr-2" /> */}
                            <AnimatedNumber className="BigNumber white" value={staffData.num_of_resident || '0'}
                                formatValue={formatValue}
                            />
                            <p>Resident</p>
                        </div>
                    </div>
                    <div className="Container col-12 col-md-3 col-lg px-3 align-items-center color-1">
                        <FaTools className="h2 mr-4 my-0" />
                        <div style={{
                            flex: 1,
                            // padding: 16,
                            // borderRight: '1px solid #f3f3fa',
                        }}>
                            <AnimatedNumber className="BigNumber white" value={staffData.num_of_technician || '0'}
                                formatValue={formatValue}
                            />
                            <p>Technician</p>
                        </div>
                    </div>
                    <div className="Container col-12 col-md-3 col-lg px-3 align-items-center color-1">
                        <MdSecurity className="h1 mr-4 my-0" />
                        <div style={{
                            flex: 1,
                            // padding: 16,
                            // borderRight: '1px solid #f3f3fa',
                        }}>
                            <AnimatedNumber className="BigNumber white" value={staffData.num_of_security || '0'}
                                formatValue={formatValue}
                            />
                            <p>Security</p>
                        </div>
                    </div>
                    <div className="Container col-12 col-md-3 col-lg px-3 align-items-center color-1">
                        <FaBoxOpen className="h1 mr-4 my-0" />
                        <div style={{
                            flex: 1,
                            // padding: 16,
                            // borderRight: '1px solid #f3f3fa',
                        }}>
                            <AnimatedNumber className="BigNumber white" value={staffData.num_of_unit
                                / staffData.num_of_courier || '0'}
                                formatValue={formatValue}
                            />
                            <p>Courier</p>
                        </div>
                    </div>
                    <div className="Container col-12 col-md-3 col-lg px-3 align-items-center color-1">
                        <RiBuilding2Line className="h1 mr-4 my-0" />
                        <div style={{
                            flex: 1,
                            // padding: 16,
                            // borderRight: '1px solid #f3f3fa',
                        }}>
                            <AnimatedNumber className="BigNumber white" value={staffData.num_of_unit
                                / staffData.num_of_building || '0'}
                                formatValue={formatValue}
                            />
                            <p className="text-nowrap">Building Manager</p>
                        </div>
                    </div>
                    <div className="Container col-12 col-md-3 col-lg px-3 align-items-center color-1">
                        <FiBriefcase className="h1 mr-4 my-0" />
                        <div style={{
                            flex: 1,
                            // padding: 16,
                            // borderRight: '1px solid #f3f3fa',
                        }}>
                            <AnimatedNumber className="BigNumber white" value={staffData.num_of_unit
                                / staffData.num_of_building || '0'}
                                formatValue={formatValue}
                            />
                            <p className="text-nowrap">General Manager</p>
                        </div>
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
                    // marginLeft: 16,
                    marginRight: 0,
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