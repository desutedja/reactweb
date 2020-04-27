import React, { useCallback, useState } from 'react';

import LabeledText from '../../components/LabeledText';
import Table from '../../components/Table';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { useSelector, useDispatch } from 'react-redux';
import { getBuildingUnit } from './slice';
import { FiPlus } from 'react-icons/fi';
import { useHistory, useRouteMatch } from 'react-router-dom';

const exception = [
    'created_on', 'modified_on', 'deleted',
    'Tasks', 'lat', 'long', 'logo'
];

const tabs = [
    'Unit', 'Unit Type', 'Section'
]

const columnsUnit = [
    { Header: "Section", accessor: "building_section" },
    { Header: "Unit Type", accessor: "unit_type" },
    { Header: "Floor", accessor: "floor" },
    { Header: "Number", accessor: "number" },
]

const columnsUnitType = [
    { Header: "Name", accessor: "unit_type" },
    { Header: "Size", accessor: "unit_size" },
]

const columnsSection = [
    { Header: "Type", accessor: "section_type" },
    { Header: "Name", accessor: "section_name" },
]

function Component() {
    const [confirm, setConfirm] = useState(false);
    const [selectedRow, setRow] = useState({});
    const [tab, setTab] = useState(0);

    const headers = useSelector(state => state.auth.headers);
    const { selected, unit, loading, refreshToggle } = useSelector(state => state.building);

    let dispatch = useDispatch();
    let history = useHistory();
    let { path, url } = useRouteMatch();

    return (
        <div>
            <Modal isOpen={confirm} onRequestClose={() => setConfirm(false)}>
                Are you sure you want to delete?
                <div style={{
                    display: 'flex',
                    marginTop: 16,
                }}>
                    <Button label="No" secondary
                        onClick={() => setConfirm(false)}
                    />
                    <Button label="Yes"
                        onClick={() => {
                            setConfirm(false);
                            // dispatch(deleteBuilding(selectedRow, headers));
                        }}
                    />
                </div>
            </Modal>
            <div style={{
                display: 'flex'
            }}>
                <div className="Container" style={{
                    flex: 3,
                    marginRight: 16,
                }}>
                    <div className="Photos">
                        {selected.logo ?
                            <img src={selected.logo} alt="logo" />
                            :
                            <img src={'https://via.placeholder.com/200'} alt="logo" />
                        }
                    </div>
                    <div className="Details">
                        {Object.keys(selected).filter(el => !exception.includes(el))
                            .map(el =>
                                <LabeledText
                                    key={el}
                                    label={el.length > 2 ? el.replace('_', ' ') : el.toUpperCase()}
                                    value={selected[el]}
                                />
                            )}
                    </div>
                </div>
                <div className="Container" style={{
                    flex: 2
                }}>

                </div>
            </div>
            <div className="Container" style={{
                marginTop: 16,
                flex: 1,
                flexDirection: 'column',
            }}>
                <div className="Tab">
                    {tabs.map((el, index) =>
                        <div key={el} className="TabItem">
                            <button className="TabItem-Text"
                                onClick={() => setTab(index)}
                            >{el}</button>
                            {tab === index && <div className="TabIndicator"></div>}
                        </div>)}
                </div>
                <Table
                    columns={tab === 0 ? columnsUnit : tab === 1 ? columnsUnitType : columnsSection}
                    data={unit.items}
                    loading={loading}
                    pageCount={unit.total_pages}
                    fetchData={useCallback((pageIndex, pageSize, search) => {
                        tab === 0 && dispatch(getBuildingUnit(headers, pageIndex, pageSize, selected));
                        // eslint-disable-next-line react-hooks/exhaustive-deps
                    }, [dispatch, refreshToggle, headers, tab])}
                    filters={[]}
                    actions={[
                        <Button key="Add" label="Add" icon={<FiPlus />}
                            onClick={() => { }}
                        />
                    ]}
                    onClickDelete={row => {
                        setRow(row);
                        setConfirm(true);
                    }}
                />
            </div>
        </div>
    )
}

export default Component;