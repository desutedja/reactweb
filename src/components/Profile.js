import React, { useState, Fragment } from 'react';
import Avatar from 'react-avatar';
import { FiGlobe, FiPhone, FiMail } from 'react-icons/fi';
import { getBank, getCountryFromCode, dateFormatter, toSentenceCase } from '../utils';
import classnames from 'classnames';

import { TabContent, TabPane, Nav, NavItem, NavLink, Container, Row, Col } from 'reactstrap';

function GroupedItems({ tabs, type, data }) {
    const [activeTab, setActiveTab] = useState(0);

    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab);
    }

    return (<>
        <Nav tabs>
            {
                Object.keys(tabs).map((el, i) =>
                    <NavItem key={i} style={{ cursor: 'default' }}>
                        <NavLink className={classnames({ active: activeTab === i })} style={{ marginLeft: '0px' }} 
                            onClick={() => toggle(i)} >{toSentenceCase(el)}</NavLink>
                    </NavItem>
                )
            }
        </Nav>
        {
            Object.keys(tabs).map((el, i) =>
                <Fragment key={i}>
                    <TabContent activeTab={activeTab}>
                        <TabPane className="ProfileTab" tabId={i} >
                            {tabs[el].map(el =>
                                <Row style={{ padding: '4px' }} key={el} >
                                    <Col sm="4" style={{ fontWeight: 'bold', fontSize: '1em', textAlign: 'left'}}>
                                        {toSentenceCase((
                                            el === 'id' ? (type === '' ? el : type + " " + el) :
                                                el === 'address' ? "Street Address" :
                                                    el === 'created_on' ? "Registered Since" :
                                                        el === 'name_legal' ? "Legal Name" :
                                                            el
                                        ).replace(/_/g, ' '))}
                                    </Col>
                                    <Col style={{ fontWeight: 'normal', fontSize: '1em', }}>
                                        {
                                            (data[el] == null || data[el] === "") ? "-" :
                                                el === "birthdate" ? dateFormatter(data[el]) :
                                                    el === "birthplace" ? data[el].toUpperCase() :
                                                        el === "address" ? toSentenceCase(data[el]) :
                                                            el === "created_on" ? dateFormatter(data[el]) :
                                                                el === "nationality" ? getCountryFromCode(data[el]) :
                                                                    el === "account_bank" ? getBank(data[el]) :
                                                                        el === "gender" ?
                                                                            (data[el] === "L" ? "Male" :
                                                                                data[el] === "P" ? "Female" : "Undefined") :
                                                                            data[el]
                                        }
                                    </Col>
                                </Row>
                            )}
                        </TabPane>
                    </TabContent>
                </Fragment>
            )
        }
    </>)
}

function Component({ type = "", title, email = null, website = null, phone = null, picture = null, filter = [], data }) {
    var grouping = {};

    switch (type) {
        case 'resident':
            grouping = {
                'profile': ['created_on', 'gender', 'birthplace', 'birthdate', 'nationality', 'marital_status', 'status_kyc'],
                'address': ['address', 'district_name', 'city_name', 'province_name'],
                'bank account': ['account_name', 'account_no', 'account_bank'],
            };
            break;
        case 'staff':
            grouping = {
                'profile': ['created_on', 'gender', 'nationality', 'marital_status', 'status_kyc'],
                'address': ['address', 'district_name', 'city_name', 'province_name'],
                'management': ['building_management_id', 'staff_id', 'staff_role'],
                'bank account': ['account_name', 'account_no', 'account_bank'],
            };
            break;
        case 'management':
            grouping = {
                'information': ['id', 'created_on', 'name_legal'],
                'Contact Person': ['pic_name', 'pic_phone', 'pic_email']
            };
            break;
        case 'building':
            grouping = {
                'information': ['id', 'created_on', 'legal_name', 'owner_name', 'code_name', 'phone', 'email'],
                'address': ['address', 'district_name', 'city_name', 'province_name', 'zipcode'],
                'others': ['max_units', 'max_floors', 'max_sections'],
            };
            break;

        default:
            break;
    }

    return (
        <Container style={{ paddingTop: '20px', paddingBottom: '30px', marginLeft: '100px' }} >
            <Row>
                <Col style={{ paddingLeft: '0px' }} xs="3">
                    <Row>
                        <Avatar size="200" name={title} email={email} src={picture !== null ? picture : data['photo']} round="10px" />
                    </Row>
                </Col>
                <Col sm="6">
                    <Row>
                        <Col style={{ display: 'block', paddingBottom: '30px' }}>
                            <div><h2>{title === null ? "" : toSentenceCase(title)}</h2></div>
                            <div style={{ display: 'flex' }} >
                                <div hidden={email === null} style={{ marginRight: '20px' }} >
                                    <h5><FiMail /><a href={"mailto:" + email}>{email}</a></h5>
                                </div>
                                <div hidden={phone === null} style={{ marginRight: '20px' }} >
                                    <h5><FiPhone /> {phone}</h5>
                                </div>
                                <div hidden={website === null} style={{ marginRight: '20px' }} >
                                    <h5><FiGlobe /><a href={website}>{website}</a></h5>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <GroupedItems tabs={grouping} type={type} data={data} />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}

export default Component;
