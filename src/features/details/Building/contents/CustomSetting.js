import React from 'react';
import { useHistory } from 'react-router-dom';

import defaultImg from '../../../../assets/fallback.jpg';

import { FaPhone } from 'react-icons/fa';

import Button from '../../../../components/Button';

import { toSentenceCase, dateFormatter, getCountryFromCode, getBank, dateTimeFormatter } from '../../../../utils';
import { FiTrash, FiEdit, FiImage } from 'react-icons/fi';
import { useSelector } from 'react-redux';

function Component({ view = false, imgPreview = false, editModal, logoModal, logoWhiteModal, splashModal, data, labels, type = "", horizontal=false,
    editable = true, editPath = 'edit', onDelete, renderButtons = () => { } }) {

    const { banks } = useSelector(state => state.main);

    let history = useHistory();

    function formatLabel(label) {
        if (label.label)
            label = label.label;

        if (label === 'created_on') label = "Main Color";
        if (label === 'legal_name') label = "Second Color";
        if (label === 'owner_name') label = "Logo URL";
        if (label === 'code_name') label = "Logo URL White";
        if (label === 'email') label = "Splash Screen";

        return toSentenceCase(label);
    }

    function formatValue(label, value) {
        return (value == null || value === "") ? "-" :
                label === "main_color" ? "#" + value :
                    label === "secondary_color" ? "#" + value : 
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
                                    <p flex={9} style={{ fontWeight: 'normal' }}>
                                        {el.vfmt ? el.vfmt(data[el.label]) : el.label ? formatValue(el.label, data[el.label])
                                            : formatValue(el, data[el])}
                                    </p>
                                  </div>
                                </div> : null;
                        })}
                    </div>
                )}
            </div>
            {!view && <div className="col-auto d-flex flex-column">
                {/* {editable && <Button icon={<FiEdit />} label="Edit" onClick={() => history.push({
                    pathname: editPath,
                    // state: data,
                })} />} */}
                {editable && <Button icon={<FiEdit />}label="Edit" onClick={() => editModal(true)} />}
                {<Button icon={<FiImage />} label="Preview Logo" color="Danger" onClick={() => logoModal(true)} />}
                {<Button icon={<FiImage />} label="Preview Logo White" color="Danger" onClick={() => logoWhiteModal(true)} />}
                {<Button icon={<FiImage />} label="Preview Splash Screen" color="Danger" onClick={() => splashModal(true)} />}
                {renderButtons()}
                {/* {onDelete && <Button icon={<FiTrash />} color="Danger" label="Delete" onClick={onDelete} />} */}
            </div>}
        </div>
    )
}

export default Component;
