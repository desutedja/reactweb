import React from 'react';
import { useHistory } from 'react-router-dom';

import defaultImg from '../../../assets/fallback.jpg';

import { FaPhone } from 'react-icons/fa';

import Button from '../../../components/Button';

import { toSentenceCase, dateFormatter, getCountryFromCode, getBank, dateTimeFormatter } from '../../../utils';
import { FiTrash, FiEdit } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { deleteFacility } from '../../slices/facility';

function Component({ view = false, imgPreview = false, data, labels, type = "", horizontal=false,
    editable = true, editPath = 'edit', onDelete, renderButtons = () => { } }) {

    const { banks } = useSelector(state => state.main);
    const csl = () => {
        console.log("data" + data);
    }

    let history = useHistory();

    function formatLabel(label) {
        if (label.label)
            label = label.label;

        if (label === 'id') label = type + " ID ";
        if (label.includes('pic_')) label = label.split('_')[1];
        if (label === 'created_date') label = "Registered Date";
        if (label === 'name_legal') label = "Legal Name";
        if (label === 'location') label = " ";
        if (label === 'name') label = "Facility Name";
        if (label === 'check_in_start_minute') label = "Check In Start Minute";
        if (label === 'status') label = "Status";
        if (label === 'description') label = " ";
        if (label === 'category') label = " ";
        if (label === 'district') label = " ";
        if (label === 'city') label = " ";

        return toSentenceCase(label);
    }

    function formatValue(label, value) {
        return (value == null || value === "") ? "-" :
                    label === "address" ? data.location :
                        label === "created_date" ? data.created_date :
                            label === "id" ? data.id :
                                label === "name" ? data.name :
                                    label === "status" ? data.status :
                                        label === "check_in_start_minute" ? data.check_in_start_minute :  
                                            label === "description" ? data.description :  
                                                label === "location" ? data.location :  
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
                            return !el.disabled && el !== "description" && (el !== "open_at" && el !== "closed_at" ) && el !== "rules" && el !== "location" ?
                                <div className="row no-gutters" style={{ padding: '4px', alignItems: 'flex-start' }} key={i} >
                                    <div className="col-auto" flex={3} style={{ fontWeight: 'bold', textAlign: 'left', minWidth: 200 }}>
                                        {el.lfmt ? el.lfmt(el) : formatLabel(el)}
                                    </div>
                                    <div className="col" flex={9} style={{ fontWeight: 'bold' }}>
                                        {el.vfmt ? el.vfmt(data[el.label]) : el.label ? formatValue(el.label, data[el.label])
                                            : formatValue(el, data[el])}
                                    </div>
                                </div> : 
                                el === "description" || el === "location" ?
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
                                : 
                                <div>
                                    <ul>
                                        {data.rules.map((item) => (
                                        <li id={item.id}>
                                            <span>{item.rule}</span>
                                        </li>
                                        ))}
                                    </ul>
                              </div>;
                        })}
                    </div>
                )}
            </div>
            {!view && <div className="col-auto d-flex flex-column">
                {editable && <Button icon={<FiEdit />} label="Edit" onClick={() => history.push({
                    pathname: editPath,
                    state: data,
                })} />}
                {renderButtons()}
                {/* {onDelete && <Button icon={<FiTrash />} color="Danger" label="Delete" onClick={(pathString,id) => (
                    pathString = history.location.pathname.split("/"),
                    id = pathString[pathString.length - 1],
                    console.log("HARUSNYA JALANNN"),
                    deleteFacility(id,history)
                )} />} */}
            </div>}
        </div>
    )
}

export default Component;
