import React, { useState, useEffect } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FiSearch, FiPlus, FiCheck, FiDownload } from 'react-icons/fi';

import Button from '../../components/Button';
import Filter from '../../components/Filter';
import Input from '../../components/Input';
import Pill from '../../components/Pill';
import Tile from '../../components/Tile';
import Merchant from '../../components/cells/Merchant';
import { getMerchant, setSelected, deleteMerchant, refresh, downloadMerchant } from '../slices/merchant';
import { toSentenceCase, dateTimeFormatterCell, inputDateTimeFormatter24 } from '../../utils';
import { merchant_types, endpointMerchant, merchant_status } from '../../settings';
import { get, getFile, patch, setInfo } from '../slice';

import TemplateWithSelection from './components/TemplateWithSelection';
import Modal from '../../components/Modal';
import moment from 'moment';


const columns = [
    {
        Header: 'Name', accessor: row => <Merchant id={row.id} data={row} items={[
            <b>{row.name}</b>,
            <p>{toSentenceCase(row.type)}</p>
        ]} />
    },
    { Header: 'Category', accessor: row => row.category ? toSentenceCase(row.category) : '-' },
    {
        Header: 'PIC', accessor: row => <div>
            <b>{row.pic_name}</b>
            <p>{row.pic_mail}</p>
        </div>
    },
    {
        Header: 'Status', accessor: row => {
            return <Tile items={[
                row.is_open === 1 ? <Pill color="primary">Open</Pill> : <Pill color="secondary">Closed</Pill>,
            ]} />
        }
    },
    { Header: 'Open Until', accessor: row => row.is_open === 1 ? dateTimeFormatterCell(row.is_open_until) : "-" }
]

function Component({ view }) {
    const [type, setType] = useState('');
    const [typeLabel, setTypeLabel] = useState('');

    const [stat, setStat] = useState('');
    const [statLabel, setStatLabel] = useState('');

    const [search, setSearch] = useState('');
    const [limit, setLimit] = useState(5);

    const [cat, setCat] = useState('');
    const [catName, setCatName] = useState('');
    const [cats, setCats] = useState('');

    const [multiActionRows, setMultiActionRows] = useState([]);
    const [onOffMerchant, setOnOffMerchant] = useState(false);

    const today = moment().format("yyyy-MM-DDTHH:mm:ss");
    const [merchantStatus, setMerchantStatus] = useState("open");
    const [openDate, setOpenDate] = useState(today);

    let dispatch = useDispatch();
    let history = useHistory();
    let { url } = useRouteMatch();

    useEffect(() => {
        dispatch(get(endpointMerchant + '/admin/categories?name=' + search, res => {
            let data = res.data.data;
            let formatted = data.map(el => ({ label: el.name, value: el.name }));
            let limited = formatted.slice(0, limit);
            
            const restTotal = formatted.length - limited.length;
            const valueLimit = 5;

            if (limited.length < formatted.length) {
                limited.push({
                    label: 'load ' + (restTotal > valueLimit ? valueLimit : restTotal) + ' more',
                    className: 'load-more',
                    restTotal: restTotal > valueLimit ? valueLimit : restTotal
                })
            }

            setCats(limited);
        }))
    }, [dispatch, limit, search]);

    useEffect(() => {
        if (search.length === 0) {
            setLimit(5);
        }
    }, [search]);

    return (
        <>
            <Modal
                isOpen={onOffMerchant}
                toggle={() => { setOnOffMerchant(false) }}
                title="Set status"
                okLabel={"Submit"}
                onClick={() => {
                    dispatch(patch(endpointMerchant+"/admin/bulk/setonoff", {
                    "merchant_id": multiActionRows,
                    "status": merchantStatus,
                    "is_open_until": merchantStatus === "open" ? inputDateTimeFormatter24(openDate) : null,
                    }, res => {
                        dispatch(
                        setInfo({
                            color: "success",
                            message: `Merchant(s) status has been updated.`,
                        })
                        );
                        // resultComponent ? setOpenRes(true) : toggle();
                    }, err => {
                    dispatch(
                        setInfo({
                        color: "error",
                        message: `Set merchant status error.`,
                        })
                    );
                    console.log("error");
                    }))

                    // dispatch(stopAsync());
                    setOnOffMerchant(false)
                    dispatch(refresh());
                }}
            > 
                <Input
                    label="Set merchant status"
                    type="radio"
                    name="status"
                    options={[
                    { value: "open", label: "Open" },
                    { value: "closed", label: "Close" },
                    ]}
                    inputValue={merchantStatus}
                    setInputValue={setMerchantStatus}
                /> 
                {merchantStatus === "open" ? 
                <Input
                    label="Open until?"
                    type="datetime-local"
                    name="is_open_until"
                    inputValue={openDate}
                    setInputValue={setOpenDate}
                /> 
                :
                null
                }

            </Modal>
            <TemplateWithSelection
                view={view}
                columns={columns}
                slice='merchant'
                getAction={getMerchant}
                deleteAction={deleteMerchant}
                selectAction={(selectedRows) => {
                    const selectedRowIds = [];
                    selectedRows.map((row) => {
                    if (row !== undefined){
                        selectedRowIds.push(row.id);
                    }
                    });    
                    setMultiActionRows([...selectedRowIds]);
                    console.log(selectedRowIds);
                }}
                filterVars={[type, cat, stat]}
                filters={[
                    {
                        hidex: type === "",
                        label: <p>{type ? "Type: " + typeLabel : "Type: All"}</p>,
                        delete: () => { setType(""); },
                        component: toggleModal =>
                            <Filter
                                data={merchant_types}
                                onClickAll={() => {
                                    setType("");
                                    setTypeLabel("");
                                    toggleModal(false);
                                }}
                                onClick={el => {
                                    setType(el.value);
                                    setTypeLabel(el.label);
                                    toggleModal(false);
                                }}
                            />
                    },
                    {
                        button: <Button key="Catgeory: All"
                            label={cat ? catName : "Category: All"}
                            selected={cat}
                        />,
                        hidex: cat === "",
                        label: <p>{cat ? "Category: " + catName : "Category: All"}</p>,
                        delete: () => { setCat(""); },
                        component: (toggleModal) =>
                            <>
                                <Input
                                    label="Search"
                                    compact
                                    icon={<FiSearch />}
                                    inputValue={search}
                                    setInputValue={setSearch}
                                />
                                <Filter
                                    data={cats}
                                    onClick={(el) => {
                                        if (!el.value) {
                                            setLimit(limit + el.restTotal);
                                            return;
                                        }
                                        setCat(el.value);
                                        setCatName(el.label);
                                        setLimit(5);
                                        toggleModal(false);
                                        setSearch("");
                                    }}
                                    onClickAll={() => {
                                        setCat("");
                                        setCatName("");
                                        setLimit(5);
                                        toggleModal(false);
                                        setSearch("");
                                    }}
                                />
                            </>
                    },
                    {
                        hidex: stat === "",
                        label: <p>{stat ? "Status: " + statLabel : "Status: All"}</p>,
                        delete: () => { setStat(""); },
                        component: toggleModal =>
                            <Filter
                                data={merchant_status}
                                onClickAll={() => {
                                    setStat("");
                                    setStatLabel("");
                                    toggleModal(false);
                                }}
                                onClick={el => {
                                    setStat(el.value);
                                    setStatLabel(el.label);
                                    toggleModal(false);
                                }}
                            />
                    },
                ]}
                renderActions={view ? null : (selectedRowIds) => {
                    return [
                    <Button key="Add Merchant" label="Add Merchant" icon={<FiPlus />}
                        onClick={() => {
                            dispatch(setSelected({}));
                            history.push(url + "/add");
                        }}
                    />,
                  
                    <Button
                        label="Open/Close Merchant"
                        disabled={Object.keys(selectedRowIds).length === 0}
                        icon={<FiCheck />}
                        onClick={() =>
                                setOnOffMerchant(true)
                        //   {
                        //     confirmAlert({
                        //       title: 'Set as Paid Billing',
                        //       message: 'Do you want to set selected unit as Paid?',
                        //       buttons: [
                        //         {
                        //           label: 'Yes',
                        //           onClick: () => {
                        //             dispatch(updateSetAsPaidSelected(multiActionRows));
                        //           },
                        //           className:"Button btn btn-secondary"
                        //         },
                        //         {
                        //           label: 'Cancel',
                        //           className:"Button btn btn-cancel"
                        //         }
                        //       ]
                        //     });
                        //   }
                        }
                    />,
                    <Button
                        key="Download Merchant"
                        label="Download Merchant.csv"
                        icon={<FiDownload />}
                        // onClick={() =>
                        //   dispatch(downloadMerchant(search, type, cat, stat ))
                        // }
                        onClick={() => {
                            dispatch(getFile(endpointMerchant + "/admin/list?" +
                            "?page=" +
                            1 +
                            "&limit=" +
                            10 +
                            "&type=" +
                            type +
                            "&category=" +
                            cat +
                            "&sort_field=created_on&sort_type=DESC" +
                            "&search=" +
                            search +
                            "&is_open=" +
                            stat + 
                            "&is_download=1",
                            "Data Merchant.csv",
                            ))}
                          }
                      />,
                ]}
            }
            />
        </>
    )
}

export default Component;
