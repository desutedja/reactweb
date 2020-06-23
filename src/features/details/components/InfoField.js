import React, { } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';

import Row from '../../../components/Row';
import Column from '../../../components/Column';
import Button from '../../../components/Button';

import { toSentenceCase, dateFormatter, getCountryFromCode, getBank } from '../../../utils';

function Component({ data, labels, type = "", editable = true }) {

    let history = useHistory();
    let { url } = useRouteMatch();

    function formatLabel(label) {
        if (label === 'id') label = type + " ID";
        if (label.includes('pic')) label = label.split('_')[1];
        if (label === 'created_on') label = "Registered Since";
        if (label === 'name_legal') label = "Legal Name";
        if (label === 'address') label = "Streed Address";

        return toSentenceCase(label);
    }

    return (
        <div style={{
            display: 'flex',
        }}>
            <div style={{
                flex: 1,
            }}>
                {labels.map(el =>
                    <Row style={{ padding: '4px', alignItems: 'flex-start' }} key={el} >
                        <Column flex={3} style={{ fontWeight: 'bold', fontSize: '1em', textAlign: 'left' }}>
                            {formatLabel(el)}
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
            <div>
                <Button label="Edit" onClick={() => history.push(
                    url.split('/').slice(0, -1).join('/') + "/edit"
                )} />
            </div>
        </div>
    )
}

export default Component;
