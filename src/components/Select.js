import React, { useState, useEffect, useRef } from 'react';
import { FiSearch } from 'react-icons/fi';
import MoonLoader from "react-spinners/MoonLoader";

import Input from './Input';
import Modal from './Modal';
import Filter from './Filter';

function Component({
    label, compact, options = [],
    search, setSearch, loading,
    inputValue, setInputValue,
}) {
    const [modal, setModal] = useState(false);

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
                {loading && <div style={{marginTop: 8}}>
                    <MoonLoader
                        size={14}
                        color={"grey"}
                        loading={loading}
                    />
                </div>}
                <Filter data={options}
                    onClick={el => {
                        setInputValue(el.value);
                        setModal(false);
                    }}
                />
            </Modal>
            <Input label={label} type="select" options={options} onClick={() => setModal(true)}
                inputValue={inputValue} setInputValue={setInputValue}
            />
        </>
    )
}

export default Component;