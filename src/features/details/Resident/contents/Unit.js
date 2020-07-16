import React, { useEffect, useCallback, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { FiX, FiSearch, FiPlus } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';

import Button from '../../../../components/Button';
import Table from '../../../../components/Table';
import Modal from '../../../../components/Modal';
import Input from '../../../../components/Input';
import Filter from '../../../../components/Filter';
import { toSentenceCase, removeLastFromPath } from '../../../../utils';
import SectionSeparator from '../../../../components/SectionSeparator';
import Resident from '../../../../components/cells/Resident';

import {
    getResidentUnit,
    addResidentUnit,
    deleteSubaccount,
    deleteUnit,
    refresh
} from '../../../slices/resident';
import { endpointAdmin, endpointResident } from '../../../../settings';
import { get } from '../../../slice';

const columnsUnit = [
    { Header: "Building", accessor: "building_name" },
    { Header: "Unit Number", accessor: "number" },
    { Header: "Level", accessor: "level" },
    { Header: "Status", accessor: "status" },
    { Header: "Type", accessor: row => row.unit_type + " - " + row.unit_size },
]

function Component({ id }) {
    const [addUnit, setAddUnit] = useState(false);
    const [delUnit, setDelUnit] = useState({
        delete: []
    })
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [confirmDeleteUnit, setConfirmDeleteUnit] = useState(false);
    const [addUnitStep, setAddUnitStep] = useState(1);

    const [addSubAccount, setAddSubAccount] = useState(false);
    const [addSubAccountStep, setAddSubAccountStep] = useState(false);
    const [residents, setResidents] = useState([]);
    const [subAccount, setSubAccount] = useState({});
    const [ownershipStatus, setOwnershipStatus] = useState('');

    const [mainOwner, setMainOwner] = useState({});

    const [search, setSearch] = useState('');

    const [selectedBuilding, setSelectedBuilding] = useState({});
    const [buildings, setBuildings] = useState([]);

    const [selectedUnit, setSelectedUnit] = useState('');
    const [units, setUnits] = useState([]);

    const [
        level,
        // setLevel
    ] = useState('main');
    const [status, setStatus] = useState('own');

    const { unit, loading, refreshToggle } = useSelector(state => state.resident);


    let dispatch = useDispatch();
    let history = useHistory();
    let { path } = useRouteMatch();

    const fetchData = useCallback((pageIndex, pageSize, search) => {
        dispatch(getResidentUnit(pageIndex, pageSize, search, id));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, refreshToggle, id])

    useEffect(() => {
        addUnitStep === 3 && selectedUnit !== '' && dispatch(get(endpointResident + '/management/resident/get_main_owner/' + selectedUnit.value.id, 
                   res => {
                       if (res.data.data.resident && res.data.data.resident.id !== 0) {
                           setMainOwner(res.data.data.resident);
                       }
                   }))
    }, [addUnitStep, selectedUnit, dispatch]);

    useEffect(() => {
        addSubAccount  && addSubAccountStep === 1 && (search.length >= 1) && 
            dispatch(get(endpointResident + '/management/resident/read' +
            '?page=1' +
            '&limit=5' +
            '&search=' + search,

            res => {
                setResidents(res.data.data.items);
            }))
    }, [addSubAccount, addSubAccountStep, dispatch, search]);

    useEffect(() => {
        addUnit && addUnitStep === 1 && (!search || search.length >= 1) && dispatch(get(endpointAdmin + '/building' +
            '?page=1' +
            '&limit=10' +
            '&search=' + search,

            res => {
                setBuildings(res.data.data.items);
            }))
    }, [addUnit, addUnitStep, dispatch, search]);

    useEffect(() => {
        addUnit && addUnitStep === 2 && (!search || search.length >= 1) && dispatch(get(endpointAdmin + '/building/unit' +
            '?page=1' +
            '&building_id=' + selectedBuilding.value.id +
            '&search=' + search +
            '&limit=10',

            res => {
                setUnits(res.data.data.items);
            }))
    }, [addUnit, search, addUnitStep, selectedBuilding, dispatch]);

    useEffect(() => {
        console.log(delUnit)
    }, [delUnit])

    const addUnitBackFunction = useCallback(() => setAddUnitStep(addUnitStep - 1), [addUnitStep]);
    const addSubBackFunction = useCallback(() => setAddSubAccountStep(addSubAccountStep - 1), [addSubAccountStep]);

    const submitFunction = (e) => {
        dispatch(addResidentUnit({
            unit_id: selectedUnit.value.id,
            owner_id: parseInt(id),
            level: level,
            status: status
        }))
        setAddUnit(false);
        setAddUnitStep(1);
    }

    const submitSubAccount = (e) => {
        dispatch(addResidentUnit({
            unit_id: selectedUnit.unit_id,
            owner_id: subAccount.id,
            level: 'sub',
            parent_id: parseInt(id),
            status: ownershipStatus.value,
        }))
        setAddSubAccount(false);
        setAddSubAccountStep(1);
    }

    const deleteSub = (e) => {
        dispatch(deleteSubaccount(
            selectedUnit.unit_id, parseInt(id), subAccount.id,
        ))
        setConfirmDelete(false);
    }

    function SubAccountList(item) {
        let subs = item.unit_sub_account
        return (
            <>
                <div >
                        <div style={{ marginBottom: '1vw'  }} ><b>{subs.length} sub accounts in this unit: </b></div>
                        <div style={{ display: 'flex', flexWrap: 'wrap' }} >
                        { subs.map(el => 
                            <div style={{ display: 'flex', marginLeft: '50px' }} onClick={ () => dispatch(refresh()) } >
                                <Resident id={el.id} data={el} onClickPath={ removeLastFromPath(path) }/>
                                <FiX size={15} style={{ marginTop: '10px', cursor: 'pointer'}} 
                                    onClick={ () => {setConfirmDelete(true); setSelectedUnit(item); setSubAccount(el)} } />
                            </div>
                          )}
                          { subs.length < 5 && 
                            <div style={{ padding: '10px', marginLeft: '50px' }} >
                                <span className="Link"
                                    onClick={() => {
                                        setAddSubAccount(true); 
                                        setAddSubAccountStep(1); 
                                        setSelectedUnit(item);
                                    } }> 
                                    <FiPlus/> Add Subaccount </span>
                            </div> }
                        </div>
                </div>
            </>
        )
    }

    function SubAccountItemList(resident, itemOnClick) { 
        return <Resident id={resident.value.id} data={resident.value} onClick={itemOnClick}/>
    }

    function AddSubAccountNotFound() {
        return (<div style={{ margin: "20px 0" }} ><p align="center">No resident with specified name or email is found. </p>
               <span onClick={() => history.push({pathname: removeLastFromPath(path) + '/add'})}
                    className="Link">Please register here.</span></div>)
    }

    return (
        <>
            <Modal 
                isOpen={confirmDelete}
                disableHeader={true}
                onClick={deleteSub}
                toggle={() => setConfirmDelete(false)}
                okLabel={"Delete"}
                cancelLabel={"Cancel"}
            >
                Are you sure you want to remove <b>{subAccount.firstname + ' ' + subAccount.lastname}</b> from this unit?
            </Modal>
            <Modal 
                isOpen={confirmDeleteUnit}
                disableHeader={true}
                onClick={() => {
                    dispatch(deleteUnit(delUnit));
                    setConfirmDeleteUnit(false);
                }}
                toggle={() => setConfirmDeleteUnit(false)}
                btnDanger={true}
                okLabel={"Delete"}
                cancelLabel={"Cancel"}
            >
                <p className="h5">Are you sure you want to remove this unit?</p>
                {delUnit.delete.length > 1 && <span className="text-danger">This will make remove all other subaccount.</span>}
            </Modal>
            <Modal
                isOpen={addSubAccount}
                title={"Add Sub Account"}
                disableFooter={addSubAccountStep === 1}
                okLabel={addSubAccountStep !== 3 ? "Back" : "Add Sub Account"}
                cancelLabel={addSubAccountStep === 1 ? "Cancel" : "Back"}
                onClick={addSubAccountStep === 3 ? submitSubAccount : addUnitBackFunction}
                onClickSecondary={addSubBackFunction}
                disablePrimary={addSubAccountStep !== 3}
                toggle={() => setAddSubAccount(false)}
                >
                {addSubAccountStep === 1 && <>
                    <Input label="Search Resident Email or Name"
                        compact
                        fullwidth
                        icon={<FiSearch />}
                        inputValue={search} setInputValue={setSearch}
                    />
                    <Filter
                        data={residents.map(el => {
                            return { label: el.firstname + ' ' + el.lastname, value: el };
                        })}
                        altDataComponent={search.length >= 1 && residents.length === 0 && AddSubAccountNotFound}
                        customComponent={SubAccountItemList}
                        onClick={(el) => {
                            setSubAccount(el);
                            setAddSubAccountStep(2);
                        }}
                    />
                </>}
                {addSubAccountStep === 2 && <>
                    <Resident id={subAccount.id} data={subAccount} onClick={()=>{}}/>
                    <hr/>
                    <p>Ownership status: </p>
                    <Filter
                        data={[{label: "Rent", value: "rent"}, {label: "Own", value: "own"}]}
                        onClick={(el) => {
                            setOwnershipStatus(el);
                            setAddSubAccountStep(3);
                        }}
                    />
                </>}
                {addSubAccountStep === 3 && <>
                    <Resident id={subAccount.id} data={subAccount} onClick={()=>{}}/>
                    <Input fullwidth type="button" label={"Sub Account Ownership Status"} inputValue={ownershipStatus.label} onClick={() => { }} />
                </>}
            </Modal>
            <Modal
                isOpen={addUnit}
                title={"Add Unit"}
                subtitle={"Register unit as a main resident"}
                disableFooter={addUnitStep === 1}
                okLabel={addUnitStep !== 3 ? "Back" : "Add Unit"}
                cancelLabel={"Back"}
                onClick={addUnitStep === 3 ? submitFunction : addUnitBackFunction}
                onClickSecondary={addUnitBackFunction}
                disablePrimary={addUnitStep !== 3 || mainOwner}
                toggle={() => setAddUnit(false)}
            >
                {addUnitStep === 1 && <>
                    <Input label="Search Building"
                        compact
                        fullwidth
                        icon={<FiSearch />}
                        inputValue={search} setInputValue={setSearch}
                    />
                    <Filter
                        data={buildings.map((el) => {
                            return { label: el.name, value: el };
                        })}
                        onClick={(el) => {
                            setSelectedBuilding(el);
                            setAddUnitStep(2);
                            setSearch('');
                        }}
                    />
                </>}
                {addUnitStep === 2 && <>
                    <Input label="Selected Building" fullwidth type="button" inputValue={selectedBuilding.label} onClick={() => { }} />
                    <SectionSeparator />
                    <Input label="Search Unit Number"
                        compact
                        fullwidth
                        icon={<FiSearch />}
                        inputValue={search} setInputValue={setSearch}
                    />
                    <Filter
                        data={units.map((el) => {
                            return {
                                label: "Room " + el.number + " - " + 
                                        toSentenceCase(el.section_type) + " " + el.section_name,
                                value: el
                            };
                        })}
                        onClick={(el) => {
                            setSelectedUnit(el);
                            setAddUnitStep(3);
                            setSearch('');
                        }}
                    />
                </>}
                {addUnitStep === 3 && <>
                    <form>
                        <Input fullwidth label="Selected Building" type="button" inputValue={selectedBuilding.label} onClick={() => {

                        }} />
                        <Input fullwidth label="Selected Unit Number" type="button" inputValue={
                            "Room " +
                            selectedUnit.value.number + " - " +
                            toSentenceCase(selectedUnit.value.section_type) + " " +
                            selectedUnit.value.section_name + " "
                        } onClick={() => {
                            
                        }} />
                        <SectionSeparator />
                        {!mainOwner ?
                        <Input fullwidth label="Status" type="select"
                            inputValue={status}
                            setInputValue={setStatus}
                            options={[
                                { value: 'own', label: 'Own' },
                                { value: 'rent', label: 'Rent' },
                            ]}
                        /> : mainOwner.id === id ?
                        <p>This resident is already the owner of this unit.</p> :
                        <>
                        <p>This unit already has main owner, click below to get to the main owner page : </p>
                        <div onClick={() => {setAddUnitStep(1); setAddUnit(false)} } style={{ display: 'flex', justifyContent: 'space-between' }} >
                            <Resident id={mainOwner.id} data={mainOwner} onClickPath={removeLastFromPath(path)} />
                        </div>
                        </>}
                    </form>
                </>}
            </Modal>
            <Table
                totalItems={unit.items.length}
                noContainer={true}
                columns={columnsUnit}
                data={unit.items.map( el =>
                    el.level === 'main' ? ({ 
                        expandable: true, 
                        subComponent: SubAccountList, 
                        ...el
                    }) : el
                )}
                loading={loading}
                pageCount={unit.total_pages}
                fetchData={fetchData}
                filters={[]}
                actions={[
                    <Button key="Add Unit" label="Add Unit" icon={<FiPlus />}
                        onClick={() => setAddUnit(true)}
                    />
                ]}
                onClickDelete={row => {
                    let del = row.unit_sub_account ? row.unit_sub_account.map(item => ({
                        unit_id: Number(row.unit_id),
                        owner_id: Number(item.id)
                    })) : []
                    del.push({
                        unit_id: Number(row.unit_id),
                        owner_id: Number(id)
                    })
                    setDelUnit({
                        delete: del
                    })
                    setConfirmDeleteUnit(true)
                }}
            />
        </>
    )
}

export default Component;
