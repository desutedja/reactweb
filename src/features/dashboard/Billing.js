import React, { useEffect, useState } from 'react';
import AnimatedNumber from "animated-number-react";

import { FiUsers, FiBriefcase } from 'react-icons/fi';
import { FaTools, FaBoxOpen } from 'react-icons/fa';
import { MdSecurity } from 'react-icons/md';
import { RiBuilding2Line, RiBuilding4Line, RiHotelLine } from 'react-icons/ri';

import { toMoney } from '../../utils';
import { endpointBilling, endpointManagement } from '../../settings';

import './style.css';
import { useDispatch, useSelector } from 'react-redux';
import { get } from '../slice';

const formatValue = (value) => value.toFixed(0);
const formatValuetoMoney = (value) => toMoney(value.toFixed(0));

function Component() {
    const { auth } = useSelector(state => state);

    const [billingData, setBillingData] = useState({});
    const [staffData, setStaffData] = useState({});

    let dispatch = useDispatch();

    useEffect(() => {
        dispatch(get(endpointBilling + '/management/billing/statistic', res => {
            setBillingData(res.data.data);
        }))
    }, [dispatch]);

    useEffect(() => {
        dispatch(get(endpointManagement + '/admin/staff/statistics', res => {
            setStaffData(res.data.data);
            console.log(res.data.data)
        }))
    }, [dispatch]);

    return (
        <>
            <div className="row no-gutters">
                {auth.role === 'sa' && <div className="col">
                    <div className="Container color-2 d-flex flex-column">
                        <div className="row no-gutters align-items-center">
                            <div className="col">
                                <AnimatedNumber className="h2 font-weight-bold white" value={staffData.num_of_building}
                                    formatValue={formatValue}
                                />
                                <div className="text-nowrap">Total Building</div>
                            </div>
                            <div className="col-auto">
                                <div className="w-auto">
                                    <RiBuilding2Line className="BigIcon white my-0" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}
                <div className="col">
                    <div className="Container color-4 d-flex flex-column">
                        <div className="row no-gutters align-items-center">
                            <div className="col">
                                <AnimatedNumber className="h2 font-weight-bold white" value={staffData.num_of_unit}
                                    formatValue={formatValue}
                                />
                                <div className="text-nowrap">Total Unit</div>
                            </div>
                            <div className="col-auto">
                                <div className="w-auto">
                                    <RiBuilding4Line className="BigIcon white my-0" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="Container color-5 d-flex flex-column">
                        <div className="row no-gutters align-items-center">
                            <div className="col">
                                <AnimatedNumber className="h2 font-weight-bold white"
                                    value={staffData.num_of_unit / staffData.num_of_building + ''}
                                    formatValue={formatValue}
                                />
                                <div className="text-nowrap">Average Unit</div>
                            </div>
                            <div className="col-auto">
                                <div className="w-auto">
                                    <RiHotelLine className="BigIcon white my-0" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="Row">
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
                        {auth.role === 'sa' && <div style={{
                            flex: 1,
                            padding: 16,
                        }}>
                            <div>Disbursed Amount</div>
                            <AnimatedNumber className="BigNumber" value={billingData.total_disburse_amount}
                                formatValue={formatValuetoMoney}
                            />
                        </div>}
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
                        {auth.role === 'sa' && <div style={{
                            flex: 1,
                            padding: 16,
                        }}>
                            <div>Undisbursed Amount</div>
                            <AnimatedNumber className="BigNumber" value={billingData.total_undisburse_amount}
                                formatValue={formatValuetoMoney}
                            />
                        </div>}
                    </div>
                </div>
            </div>


            <div className="" style={{
                marginRight: 0,
                flexDirection: 'column',
                padding: 0,
            }}>
                <div className="row no-gutters">
                    <div className="col-6 col-md-4 col-lg">
                        <div className="Container align-items-center color-1">
                            <div style={{
                                width: 'auto'
                            }}>
                                <FiUsers className="h1 mr-4 my-0" />

                            </div>
                            <div style={{
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
                    </div>
                    <div className="col-6 col-md-4 col-lg">
                        <div className="Container align-items-center color-1">
                            <div style={{
                                width: 'auto'
                            }}>
                                <FaTools className="h2 mr-4 my-0" />

                            </div>
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
                    </div>
                    <div className="col-6 col-md-4 col-lg">
                        <div className="Container align-items-center color-1">
                            <div style={{
                                width: 'auto'
                            }}>
                                <MdSecurity className="h1 mr-4 my-0" />
                            </div>
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
                    </div>
                    <div className="col-6 col-md-4 col-lg">
                        <div className="Container align-items-center color-1">
                            <div style={{
                                width: 'auto'
                            }}>
                                <FaBoxOpen className="h1 mr-4 my-0" />
                            </div>
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
                    </div>
                    <div className="col-6 col-md-4 col-lg">
                        <div className="Container align-items-center color-1">
                            <div className="w-auto">
                                <RiBuilding2Line className="h1 mr-4 my-0" />
                            </div>
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
                    </div>
                    <div className="col-6 col-md-4 col-lg">
                        <div className="Container align-items-center color-1">
                            <div style={{
                                width: 'auto'
                            }}>
                                <FiBriefcase className="h1 mr-4 my-0" />
                            </div>
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
            </div>
        </>
    )
}

export default Component;