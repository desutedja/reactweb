import React from 'react';
import Avatar from 'react-avatar';
import { Container, Row, Col } from 'reactstrap';
import { FiPhone, FiMail } from 'react-icons/fi';
import SectionSeparator from './SectionSeparator';
import { dateFormatter, toSentenceCase } from '../utils';

function Component({type="", email, fullname, picture=null, filter=[
        'created_on', 'modified_on', 'deleted',
        'firstname', 'lastname', 'email', 'district', 'city', 'province', 'phone',
        'photo',
        ], grouping = {
            'address': ['address', 'district_name', 'city_name', 'province_name'],
            'profile': ['birthplace', 'birthdate', 'nationality', 'marital_status']
        } , 
        data}) {
    return (
        <Container style={{ paddingTop: '20px', paddingBottom: '20px' }} >
            <Row>
                <Col style={{ paddingLeft: '0px' }} xs="3">
                    <Row>
                        <Avatar size="200" name={fullname} email={email} src={picture == null ? data['photo'] : picture} round="10px"/>
                    </Row>
                    <Row>

                    </Row>
                </Col>
                <Col xs="6">
                    <Row>
                        <Col>
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
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            {
                                Object.keys(data).filter(el => !filter.includes(el)).map(el =>
                                    <Row>
                                        <Col style={{ fontWeight: 'bold', fontSize: '0.8em',  }}>
                                            {(el === "id" ? 
                                                (type === "" ? el : type + " " + el)
                                                : el)
                                                .replace(/_/g, ' ').toUpperCase()}
                                        </Col>
                                        <Col>
                                            { 
                                                (data[el] == null || data[el] == "") ? "-" :
                                                el == "birthdate" ? dateFormatter(data[el]) :
                                                el == "birthplace" ? data[el].toUpperCase() : 
                                                el == "gender" ? 
                                                    (data[el] == "L" ? "Male" :
                                                     data[el] == "P" ? "Female" : "Undefined") :
                                                data[el]
                                            }
                                        </Col>
                                    </Row>
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
