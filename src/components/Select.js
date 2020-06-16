import React, { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import MoonLoader from "react-spinners/MoonLoader";

import Input from './Input';
import Modal from './Modal';
import Filter from './Filter';

function Component({
    label, name, compact, options = [],
    loading, inputValue, setInputValue,
}) {
    const [modal, setModal] = useState(false);
    const [search, setSearch] = useState('');
    const [searched, setSearched] = useState(options);

    useEffect(() => {
        if (!search || search.length >= 3) {
            let result = options.filter(el => el.label.toLowerCase().includes(search.toLowerCase()));

            setSearched(result);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, options]);

    return (
        <>
            <Modal isOpen={modal} onRequestClose={() => setModal(false)}>
                <Input
                    label="Search"
                    compact
                    icon={<FiSearch />}
                    inputValue={search}
                    setInputValue={setSearch}
                />
                {loading && <div style={{ marginTop: 8 }}>
                    <MoonLoader
                        size={14}
                        color={"grey"}
                        loading={loading}
                    />
                </div>}
                <Filter data={searched}
                    onClick={el => {
                        setInputValue && setInputValue(el.value);
                        setModal(false);
                    }}
                />
            </Modal>
            <Input label={label} name={name}
                onClick={() => setModal(true)} inputValue={inputValue}
                setInputValue={setInputValue}
            />
        </>
    )
}

export default Component;