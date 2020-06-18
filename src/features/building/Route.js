import React, { useCallback, useState, useEffect } from 'react';
import { useRouteMatch, Switch, Route, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiPlus, FiSearch } from 'react-icons/fi';

import Table from '../../components/Table';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Modal from '../../components/Modal';
import Link from '../../components/Link';
import Add from './Add';
import Details from './Details';
import { getBuilding, deleteBuilding, getBuildingDetails, setSelected } from './slice';
import { get } from '../../utils';
import { endpointResident } from '../../settings';

const columns = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Name', accessor: 'name' },
    { Header: 'Legal Name', accessor: 'legal_name' },
    { Header: 'Code Name', accessor: 'code_name' },
    { Header: 'Owner', accessor: 'owner_name' },
    { Header: 'Website', accessor: row => <Link>{row.website}</Link> },
]

function Component() {
    const [confirm, setConfirm] = useState(false);
    const [selectedRow, setRow] = useState({});

    const [modalType, setType] = useState("province");

    const [search, setSearch] = useState("");

    const [district, setDistrict] = useState("");
    const [districtName, setDistrictName] = useState("");
    const [districts, setDistricts] = useState([]);
    const [filteredDistricts, setFilteredDistricts] = useState([]);

    const [city, setCity] = useState("");
    const [cityName, setCityName] = useState("");
    const [cities, setCities] = useState([]);
    const [filteredCities, setFilteredCities] = useState([]);

    const [province, setProvince] = useState("");
    const [provinceName, setProvinceName] = useState("");
    const [provinces, setProvinces] = useState([]);
    const [filteredProvinces, setFilteredProvinces] = useState([]);

    const headers = useSelector(state => state.auth.headers);
    const { loading, items, total_pages, total_items, refreshToggle } = useSelector(state => state.building);

    let dispatch = useDispatch();
    let history = useHistory();
    let { path, url } = useRouteMatch();

    useEffect(() => {
        get(endpointResident + '/geo/province',
            headers,
            res => {
                setProvinces(res.data.data);
                setFilteredProvinces(res.data.data);
            }
        )
    }, [headers]);

    useEffect(() => {
        setCity("");
        setCityName("")
        province && get(endpointResident + '/geo/province/' + province,
            headers,
            res => {
                setCities(res.data.data);
                setFilteredCities(res.data.data);
            }
        )
    }, [headers, province]);

    useEffect(() => {
        setDistrict("");
        setDistrictName("")
        city && get(endpointResident + '/geo/city/' + city,
            headers,
            res => {
                setDistricts(res.data.data);
                setFilteredDistricts(res.data.data);
            }
        )
    }, [city, headers]);

    useEffect(() => {
        let filtered = (modalType === "province" ? provinces :
            modalType === "city" ? cities : districts
        ).filter(el => el.name.toLowerCase().includes(search));

        modalType === "province" ? setFilteredProvinces(filtered) :
            modalType === "city" ? setFilteredCities(filtered) :
                setFilteredDistricts(filtered);
    }, [cities, districts, modalType, provinces, search]);

    function select(item) {
        modalType === "province" ? setProvince(item.id) :
            modalType === "city" ? setCity(item.id) :
                setDistrict(item.id);
        modalType === "province" ? setProvinceName(item.name) :
            modalType === "city" ? setCityName(item.name) :
                setDistrictName(item.name);
        setSearch("");
    }

    function ModalComponent(toggleModal) {
        return (
            <>
                <Input
                    label="Search"
                    compact
                    icon={<FiSearch />}
                    inputValue={search}
                    setInputValue={setSearch}
                />
                <div className="List">
                    {!search && <button
                        key="all"
                        className="ListItem"
                        onClick={() => {
                            select("", "");
                            toggleModal(false);
                        }}
                    >
                        ALL
                    </button>}
                    {modalType === "province" && filteredProvinces.map(el => <button
                        key={el.name}
                        className="ListItem"
                        onClick={() => {
                            select(el)
                            toggleModal(false);
                        }}
                    >
                        {el.name}
                    </button>)}
                    {modalType === "city" && filteredCities.map(el => <button
                        key={el.name}
                        className="ListItem"
                        onClick={() => {
                            select(el)
                            toggleModal(false);
                        }}
                    >
                        {el.name}
                    </button>)}
                    {modalType === "district" && filteredDistricts.map(el => <button
                        key={el.name}
                        className="ListItem"
                        onClick={() => {
                            select(el)
                            toggleModal(false);
                        }}
                    >
                        {el.name}
                    </button>)}
                </div>
            </>
        )
    }

    return (
        <div>
            <Modal disableFooter={true} disableHeader={true} isOpen={confirm} onRequestClose={() => setConfirm(false)}>
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
                            dispatch(deleteBuilding(selectedRow, headers));
                        }}
                    />
                </div>
            </Modal>
            <Switch>
                <Route exact path={path}>
                    <Table totalItems={total_items}
                        columns={columns}
                        data={items}
                        loading={loading}
                        pageCount={total_pages}
                        fetchData={useCallback((pageIndex, pageSize, search) => {
                            dispatch(getBuilding(headers, pageIndex, pageSize, search, province, city, district));
                            // eslint-disable-next-line react-hooks/exhaustive-deps
                        }, [dispatch, refreshToggle, headers, province, city, district])}
                        filters={[
                            {
                                button: city && <Button key="Select District" label={district ? "District: " + districtName : "Select District"}
                                    selected={district}
                                    onClick={() => {
                                        setType("district");
                                    }}
                                />,
                                component: ModalComponent,
                            },
                            {
                                button: province && <Button key="Select City" label={city ? "City: " + cityName : "Select City"}
                                    selected={city}
                                    onClick={() => {
                                        setType("city");
                                    }}
                                />,
                                component: ModalComponent,
                            },
                            {
                                button: <Button key="Select Province" label={province ? "Province: " + provinceName : "Select Province"}
                                    selected={province}
                                    onClick={() => {
                                        setType("province");
                                    }}
                                />,
                                component: ModalComponent,
                            },
                        ]}
                        actions={[
                            <Button key="Add Building" label="Add Building" icon={<FiPlus />}
                                onClick={() => {
                                    dispatch(setSelected({}));
                                    history.push(url + "/add");
                                }}
                            />
                        ]}
                        onClickDelete={row => {
                            setRow(row);
                            setConfirm(true);
                        }}
                        onClickDetails={row => dispatch(getBuildingDetails(row, headers, history, url))}

                    />
                </Route>
                <Route path={`${path}/add`}>
                    <Add />
                </Route>
                <Route path={`${path}/edit`}>
                    <Add />
                </Route>
                <Route path={`${path}/details`}>
                    <Details />
                </Route>
            </Switch>
        </div>
    )
}

export default Component;
