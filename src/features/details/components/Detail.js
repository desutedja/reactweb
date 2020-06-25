import React, { } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';

import Row from '../../../components/Row';
import Column from '../../../components/Column';
import Button from '../../../components/Button';

import { toSentenceCase, dateFormatter, getCountryFromCode, getBank } from '../../../utils';
import { render } from '@testing-library/react';

function Component({ data, labels, type = "", editable = true, renderButtons = () => {} }) {

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

    function formatValue(label, value) {
        return (value == null || value === "") ? "-" :
            label === "birthdate" ? dateFormatter(value) :
                label === "birthplace" ? value.toUpperCase() :
                    label === "address" ? toSentenceCase(value) :
                        label === "created_on" ? dateFormatter(value) :
                            label === "nationality" ? getCountryFromCode(value) :
                                label === "account_bank" ? getBank(value) :
                                    label === "gender" ?
                                        (value === "L" ? "Male" :
                                            value === "P" ? "Female" : "Undefined") :
                                        value
    }

    return (
        <div style={{
            display: 'flex',
        }}>
            <div style={{
                flex: 1,
            }}>
                {Object.keys(labels).map((group, i) =>
                    <div key={i} style={{
                        marginBottom: 16,
                    }}>
                        <div style={{
                            color: 'grey',
                            fontSize: '1.2rem',
                            borderBottom: '1px solid silver',
                            width: 200,
                            marginBottom: 8,
                            marginLeft: 4,
                        }}>
                            {group}
                        </div>
                        {labels[group].map(el =>
                            <Row style={{ padding: '4px', alignItems: 'flex-start' }} key={el} >
                                <Column flex={3} style={{ fontWeight: 'bold', fontSize: '1em', textAlign: 'left' }}>
                                    {formatLabel(el)}
                                </Column>
                                <Column flex={9} style={{ fontWeight: 'normal', fontSize: '1em', }}>
                                    {formatValue(el, data[el])}
                                </Column>
                            </Row>
                        )}
                    </div>
                )}
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
            }}>
                {editable && <Button label="Edit" onClick={() => history.push(
                    url.split('/').slice(0, -1).join('/') + "/edit"
                )} />}
                {renderButtons()}
            </div>
        </div>
    )
}

export default Component;
