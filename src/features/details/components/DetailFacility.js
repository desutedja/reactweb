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

        if (label === 'id') label = type + " ID ";
        if (label.includes('pic_')) label = label.split('_')[1];
        if (label === 'created_on') label = "Registered Date";
        if (label === 'name_legal') label = "Legal Name";
        if (label === 'address') label = "Street Address";
        if (label === 'name') label = "Facility Name";
        if (label === 'type') label = "Quota";
        if (label === 'legal') label = "Duration";
        if (label === 'open_at') label = "Check-In Schedule";
        if (label === 'closed_at') label = "Check-Out Schedule";
        if (label === 'description') label = " ";
        if (label === 'category') label = " ";
        if (label === 'district') label = " ";
        if (label === 'city') label = " ";

        return toSentenceCase(label);
    }

    function formatValue(label, value) {
        return (value == null || value === "") ? "-" :
            label.includes('phone') ? '+' + value :
                label === "birthdate" ? dateFormatter(value, '-') :
                    label === "birthplace" ? value.toUpperCase() :
                        label === "address" ? toSentenceCase(value) :
                            label === "created_on" ? "01 Juni 2022" :
                                label === "nationality" ? getCountryFromCode(value) :
                                    label === "account_bank" ? getBank(value, banks) :
                                        label === "gender" ?
                                            (value === "L" ? "Male" :
                                                value === "P" ? "Female" : "Undefined") :
                                                    label === "id" ? "102" :
                                                        label === "name" ? "Yipy Gym" :
                                                            label === "legal" ? "1 Hour" :
                                                                label === "type" ? "100" :  
                                                                    label === "open_at" ? "Toilet" :  
                                                                        label === "closed_at" ? "Wifi" :
                                                                            label === "category" ? "Yipy Gym" :    
                                                                                label === "description" ? "Gold's Gym Indonesia has been operating under the corporate epresentation of PT Fit and Health Indonesia since 2007. Our gyms are built to help people realize." :  
                                                                                    label === "district" ? "1. Mengikuti aturan protokol kesehatan." :
                                                                                        label === "city" ? "2. Dilarang membawa hewan peliharaan.":
                                                                                value
    }

    return (
        <div className="row no-gutters w-100" style={{ justifyContent: 'space-between' }}>
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
            <div className={horizontal ? "row" : "col"}>
                {Object.keys(labels).map((group, i) =>
                    <div key={i} style={{
                        marginBottom: 16,
                        marginRight: 30,
                    }}>
                        {group !== '' && <div style={{
                            color: '#5A5A5A',
                            paddingBottom: 8,
                            borderBottom: '1px solid silver',
                            width: 200,
                            marginBottom: 8,
                            marginLeft: 4,
                            fontSize: "14px",
                            fontWeight: 700,
                        }}>
                            {group}
                        </div>}
                        {labels[group].map((el, i) => {
                            return !el.disabled && el !== "description" && (el !== "district" && el !== "city" && el !== "open_at" && el !== "closed_at" ) ?
                                <div className="row no-gutters" style={{ padding: '4px', alignItems: 'flex-start' }} key={i} >
                                    <div className="col-auto" flex={3} style={{ fontWeight: 'bold', textAlign: 'left', minWidth: 200 }}>
                                        {el.lfmt ? el.lfmt(el) : formatLabel(el)}
                                    </div>
                                    <div className="col" flex={9} style={{ fontWeight: 'bold' }}>
                                        {el.vfmt ? el.vfmt(data[el.label]) : el.label ? formatValue(el.label, data[el.label])
                                            : formatValue(el, data[el])}
                                    </div>
                                </div> : 
                                el === "description" ?
                                <div className="row no-gutters" style={{ padding: '4px', alignItems: 'flex-start' }} key={i} >
                                <div className="col" flex={9} style={{ fontWeight: 'normal' }}>
                                    {el.vfmt ? el.vfmt(data[el.label]) : el.label ? formatValue(el.label, data[el.label])
                                        : formatValue(el, data[el])}
                                </div>
                                    <div className="col-auto" flex={3} style={{ fontWeight: 'bold', textAlign: 'left', minWidth: 200 }}>
                                        {el.lfmt ? el.lfmt(el) : formatLabel(el)}
                                    </div>
                                </div>
                                : 
                                el === "district" ?
                                <div className="row no-gutters" style={{ padding: '4px', alignItems: 'flex-start' }} key={i} >
                                <div className="col" flex={9} style={{ fontWeight: 'normal' }}>
                                    {el.vfmt ? el.vfmt(data[el.label]) : el.label ? formatValue(el.label, data[el.label])
                                        : formatValue(el, data[el])}
                                </div>
                                </div>
                                : 
                                el === "city" ?
                                <div className="row no-gutters" style={{ padding: '4px', alignItems: 'flex-start' }} key={i} >
                                <div className="col" flex={9} style={{ fontWeight: 'normal' }}>
                                    {el.vfmt ? el.vfmt(data[el.label]) : el.label ? formatValue(el.label, data[el.label])
                                        : formatValue(el, data[el])}
                                </div>
                                </div>
                                :
                                el === "open_at" || el === "closed_at" ?
                                <div className="row no-gutters" style={{ padding: '4px', alignItems: 'flex-start' }} key={i} >
                                <div className="col" flex={9} style={{ fontWeight: 'normal' }}>
                                    {el === "open_at" ?
                                        <img src={require('./../../../assets/ic-toilet-enable.jpg')} width="40" height="40" style={{marginRight:5}} />
                                        :
                                        <img src={require('./../../../assets/ic-wifi-enable.jpg')} width="40" height="40" style={{marginRight:5}} />
                                    }
                                    {el.vfmt ? el.vfmt(data[el.label]) : el.label ? formatValue(el.label, data[el.label])
                                        : formatValue(el, data[el])}
                                </div>
                                </div>
                                // :
                                // el === "closed_at" ?
                                // <div className="row no-gutters" style={{ padding: '4px', alignItems: 'flex-start' }} key={i} >
                                // <div className="col" flex={9} style={{ fontWeight: 'normal' }}>
                                //     <img src={require('./../../../assets/ic-wifi.jpg')} width="40" height="40" style={{marginRight:5}} />
                                //     {el.vfmt ? el.vfmt(data[el.label]) : el.label ? formatValue(el.label, data[el.label])
                                //         : formatValue(el, data[el])}
                                // </div>
                                // </div>
                                : null;
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
