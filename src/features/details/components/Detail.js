import React from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';

import defaultImg from '../../../assets/fallback.jpg';

import { FaPhone } from 'react-icons/fa';

import Row from '../../../components/Row';
import Column from '../../../components/Column';
import Button from '../../../components/Button';

import { toSentenceCase, dateFormatter, getCountryFromCode, getBank } from '../../../utils';
import { FiTrash, FiEdit } from 'react-icons/fi';
import { useSelector } from 'react-redux';

function Component({ imgPreview = false, data, labels, type = "",
    editable = true, onDelete, renderButtons = () => { } }) {

    const { banks } = useSelector(state => state.main);

    let history = useHistory();
    let { url } = useRouteMatch();

    function formatLabel(label) {
        if (label.label)
            label = label.label;

        if (label === 'id') label = type + " ID";
        if (label.includes('pic_')) label = label.split('_')[1];
        if (label === 'created_on') label = "Registered Since";
        if (label === 'name_legal') label = "Legal Name";
        if (label === 'address') label = "Street Address";

        return toSentenceCase(label);
    }

    function formatValue(label, value) {
        return (value == null || value === "") ? "-" :
            label.includes('phone') ? '+' + value :
                label === "birthdate" ? dateFormatter(value, '-') :
                    label === "birthplace" ? value.toUpperCase() :
                        label === "address" ? toSentenceCase(value) :
                            label === "created_on" ? dateFormatter(value, '-') :
                                label === "nationality" ? getCountryFromCode(value) :
                                    label === "account_bank" ? getBank(value, banks) :
                                        label === "gender" ?
                                            (value === "L" ? "Male" :
                                                value === "P" ? "Female" : "Undefined") :
                                            value
    }

    return (
        <div className="row no-gutters">
            {imgPreview && <div className="col-12 col-md-5 col-lg-3 mb-4 mb-md-0 mr-4">
                <div className="row no-gutters h-100">
                    <div className="col-12">
                        {data.assignee_photo ?
                            <img
                                style={{
                                    width: '100%'
                                }}
                                src={data.assignee_photo} alt=""
                            /> :
                            <img
                                style={{
                                    width: '100%'
                                }}
                                src={defaultImg} alt=""
                            />
                        }
                    </div>
                    <div className="col-12 mt-3 d-flex align-items-center">
                        <FaPhone className="mr-2 h5 m-0" /><span className="h5 m-0">+{data.assignee_phone}</span>
                    </div>
                </div>
            </div>}
            <div className="col">
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
                        {labels[group].map(el => {
                            return !el.disabled ?
                                <Row style={{ padding: '4px', alignItems: 'flex-start' }} key={el} >
                                    <Column flex={3} style={{ fontWeight: 'bold', fontSize: '1em', textAlign: 'left' }}>
                                        {el.lfmt ? el.lfmt(el) : formatLabel(el)}
                                    </Column>
                                    <Column flex={9} style={{ fontWeight: 'normal', fontSize: '1em', }}>
                                        {el.vfmt ? el.vfmt(data[el.label]) : formatValue(el, data[el])}
                                    </Column>
                                </Row> : null;
                        })}
                    </div>
                )}
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
            }}>
                {editable && <Button icon={<FiEdit />} label="Edit" onClick={() => history.push({
                    pathname: url.split('/').slice(0, -1).join('/') + "/edit",
                    state: data,
                })} />}
                {onDelete && <Button icon={<FiTrash />} color="danger" label="Delete" onClick={onDelete} />}
                {renderButtons()}
            </div>
        </div>
    )
}

export default Component;
