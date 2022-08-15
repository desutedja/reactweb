import React from 'react';
import { useHistory } from 'react-router-dom';

import defaultImg from '../../../assets/fallback.jpg';

import { FaPhone } from 'react-icons/fa';

import Button from '../../../components/Button';

import { toSentenceCase, dateFormatter, getCountryFromCode, getBank, dateTimeFormatter } from '../../../utils';
import { FiTrash, FiEdit } from 'react-icons/fi';
import { useSelector } from 'react-redux';

function Component({ view = false, imgPreview = false, data, labels, type = "", horizontal=false,
    editable = true, editPath = 'edit', onDelete, renderButtons = () => { } }) {

    const { banks } = useSelector(state => state.main);

    let history = useHistory();

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
                            label === "created_on" ? dateTimeFormatter(value, '-') :
                                label === "nationality" ? getCountryFromCode(value) :
                                    label === "account_bank" ? getBank(value, banks) :
                                        label === "gender" ?
                                            (value === "L" ? "Male" :
                                                value === "P" ? "Female" : "Undefined") :
                                            value
    }

    return (
        <div className="row no-gutters w-100" style={{ justifyContent: 'space-between' }}>
            <div className={horizontal ? "row" : "col"}>
                {Object.keys(labels).map((group, i) =>
                    <div key={i} style={{
                        marginBottom: 16,
                        marginRight: 30,
                    }}>
                        {group !== '' && <div style={{
                            color: 'grey',
                            borderBottom: '1px solid silver',
                            width: 200,
                            marginBottom: 8,
                            marginLeft: 4,
                        }}>
                            {group}
                        </div>}
                        {labels[group].map((el, i) => {
                            return !el.disabled ?
                                <div className="row no-gutters" style={{ padding: '4px', alignItems: 'flex-start' }} key={i} >
                                    <div className="col-auto" flex={3} style={{ fontWeight: 'bold', textAlign: 'left', minWidth: 200 }}>
                                        {el.lfmt ? el.lfmt(el) : formatLabel(el)}
                                    </div>
                                    <div className="col" flex={9} style={{ fontWeight: 'normal' }}>
                                        {el.vfmt ? el.vfmt(data[el.label]) : el.label ? formatValue(el.label, data[el.label])
                                            : formatValue(el, data[el])}
                                    </div>
                                </div> : null;
                        })}
                    </div>
                )}
            </div>
            {!view && <div className="col-auto d-flex flex-column">
                {editable && <Button icon={<FiEdit />} label="Edit" onClick={() => history.push({
                    pathname: editPath,
                    // state: data,
                })} />}
                {renderButtons()}
                {onDelete && <Button icon={<FiTrash />} color="Danger" label="Delete" onClick={onDelete} />}
            </div>}
        </div>
    )
}

export default Component;
