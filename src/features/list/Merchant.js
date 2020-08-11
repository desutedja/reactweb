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

function Component({ view }) {
    const [type, setType] = useState('');
    const [typeLabel, setTypeLabel] = useState('');

    const [search, setSearch] = useState('');
    const [limit, setLimit] = useState(5);

    const [cat, setCat] = useState('');
    const [catName, setCatName] = useState('');
    const [cats, setCats] = useState('');

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
        <Template
            view={view}
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
            ]}
            actions={view ? null : [
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
