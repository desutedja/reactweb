import React from 'react';
import Avatar from 'react-avatar';
import { Container, Row, Col } from 'reactstrap';
import { FiPhone, FiMail } from 'react-icons/fi';
import SectionSeparator from './SectionSeparator';
import { dateFormatter, toSentenceCase } from '../utils';

function GroupedItems({name, keys, type, data}) {
     return (<>
            <Row style={{ paddingTop: '10px' }} ><h6>{toSentenceCase(name)}</h6></Row>
            <hr style={{ marginTop: '0' }} />
         { keys.map( el => 
            <Row>
                <Col style={{ fontWeight: 'bold', fontSize: '0.8em',  }}>
                    {(
                        el === 'id' ? (type === '' ? el : type + " " + el) :
                        el === 'address' ? "Street Address" :
                        el
                    ).replace(/_/g, ' ').toUpperCase()}
                </Col>
                <Col>
                    { 
                        (data[el] == null || data[el] == "") ? "-" :
                        el == "birthdate" ? dateFormatter(data[el]) :
                        el == "birthplace" ? data[el].toUpperCase() : 
                        el == "address" ? toSentenceCase(data[el]) :
                        el == "gender" ? 
                            (data[el] == "L" ? "Male" :
                             data[el] == "P" ? "Female" : "Undefined") :
                        data[el]
                    }
                </Col>
            </Row>
         )}
     </>)
         
}

function Component({type="", email, fullname, picture=null, filter=[
        'created_on', 'modified_on', 'deleted',
        'firstname', 'lastname', 'email', 'district', 'city', 'province', 'phone',
        'photo',
        ], grouping = {
            'profile': ['gender', 'birthplace', 'birthdate', 'nationality', 'marital_status', 'status_kyc'],
            'address': ['address', 'district_name', 'city_name', 'province_name'],
            'bank account': ['account_name', 'account_no', 'account_bank'],
        } , 
        data}) {
    return (
        <Container style={{ paddingTop: '20px', paddingBottom: '30px' }} >
            <Row>
                <Col style={{ paddingLeft: '0px' }} xs="3">
                    <Row>
                        <Avatar size="200" name={fullname} email={email} src={picture == null ? data['photo'] : picture} round="10px"/>
                    </Row>
                    <Row>

                    </Row>
                </Col>
                <Col sm="6">
                    <Row>
                        <div style={{ display: 'block', paddingBottom: '10px' }}>
                            <div><h2>{toSentenceCase(fullname)}</h2></div>
                            <div style={{ display: 'flex' }} >
                                <div style={{ marginRight: '20px' }} >
                                    <h5><FiMail/> {email}</h5>
                                </div>
                                <div><h5><FiPhone/> {data['phone']}</h5></div>
                            </div>
                            <SectionSeparator />
                        </div>
                    </Row>
                    <Row>
                        <Col>
                            {
                                Object.keys(grouping).map(g => 
                                    <GroupedItems name={g} keys={grouping[g]} type={type} data={data} />
                                )
                            }
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}

export default Component;
