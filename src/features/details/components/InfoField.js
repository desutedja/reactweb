import React, { } from 'react';

import Row from '../../../components/Row';
import Column from '../../../components/Column';

import { toSentenceCase, dateFormatter, getCountryFromCode, getBank } from '../../../utils';

function Component({ data, labels, type = "" }) {

    return (
        <div>
            {labels.map(el =>
                <Row style={{ padding: '4px', alignItems: 'flex-start' }} key={el} >
                    <Column flex={3} style={{ fontWeight: 'bold', fontSize: '1em', textAlign: 'left' }}>
                        {toSentenceCase((
                            el === 'id' ? (type === '' ? 'ID' : type + " " + el) :
                                el === 'address' ? "Street Address" :
                                    el === 'created_on' ? "Registered Since" :
                                        el === 'name_legal' ? "Legal Name" :
                                            el
                        ).replace(/_/g, ' '))}
                    </Column>
                    <Column flex={9} style={{ fontWeight: 'normal', fontSize: '1em', }}>
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
                    </Column>
                </Row>
            )}
        </div>

    )
}

export default Component;
