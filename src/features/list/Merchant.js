import React, { useState, useEffect } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FiSearch, FiPlus } from 'react-icons/fi';

import Button from '../../components/Button';
import Filter from '../../components/Filter';
import Input from '../../components/Input';
import Pill from '../../components/Pill';
import Tile from '../../components/Tile';
import Merchant from '../../components/cells/Merchant';
import { getMerchant, setSelected, deleteMerchant } from '../slices/merchant';
import { toSentenceCase, dateTimeFormatterCell } from '../../utils';
import { merchant_types, endpointMerchant } from '../../settings';
import { get } from '../slice';

import Template from './components/Template';

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
        Header: 'Open', accessor: row => {
            return <Tile items={[
                row.is_open === 1 ? <Pill color="primary">Open</Pill> : <Pill color="secondary">Closed</Pill>,
            ]} />
        }
    },
    { Header: 'Open Until', accessor: row => row.is_open === 1 ? dateTimeFormatterCell(row.is_open_until) : "-" }
]

function Component() {
    const [type, setType] = useState('');
    const [typeLabel, setTypeLabel] = useState('');

    const [search, setSearch] = useState('');

    const [cat, setCat] = useState('');
    const [catName, setCatName] = useState('');
    const [cats, setCats] = useState('');

    let dispatch = useDispatch();
    let history = useHistory();
    let { url } = useRouteMatch();

    useEffect(() => {
        dispatch(get(endpointMerchant + '/admin/categories', res => {
            let data = res.data.data;

            let formatted = data.map(el => ({ label: el.name, value: el.name }));

            setCats(formatted);
        }))
    }, [dispatch]);

    return (
        <Template
            columns={columns}
            slice='merchant'
            getAction={getMerchant}
            deleteAction={deleteMerchant}
            filterVars={[type, cat]}
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
                                    setCat(el.value);
                                    setCatName(el.label);
                                    toggleModal(false);
                                    setSearch("");
                                }}
                                onClickAll={() => {
                                    setCat("");
                                    setCatName("");
                                    toggleModal(false);
                                    setSearch("");
                                }}
                            />
                        </>
                },
            ]}
            actions={[
                <Button key="Add Merchant" label="Add Merchant" icon={<FiPlus />}
                    onClick={() => {
                        dispatch(setSelected({}));
                        history.push(url + "/add");
                    }}
                />,
            ]}
        />
    )
}

export default Component;
