import React, { useState, useEffect } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FiPlus, FiSearch } from 'react-icons/fi';

import Button from '../../components/Button';
import Input from '../../components/Input';
import Link from '../../components/Link';
import Building from '../../components/cells/Building';
import { getBuilding, deleteBuilding, getBuildingDetails, setSelected } from '../slices/building';
import { endpointResident } from '../../settings';
import { get } from '../slice';

import Template from './components/Template';

const columns = [
    // { Header: 'ID', accessor: 'id' },
    { Header: 'Name', accessor: row => <Building id={row.id} /> },
    { Header: 'Legal Name', accessor: 'legal_name' },
    { Header: 'Code Name', accessor: 'code_name' },
    { Header: 'Owner', accessor: 'owner_name' },
    { Header: 'Website', accessor: row => <Link>{row.website}</Link> },
]

function Component() {
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

    let dispatch = useDispatch();
    let history = useHistory();
    let { url } = useRouteMatch();

    useEffect(() => {
        dispatch(get(endpointResident + '/geo/province',
            res => {
                setProvinces(res.data.data);
                setFilteredProvinces(res.data.data);
            }
        ))
    }, [dispatch]);

    useEffect(() => {
        setCity("");
        setCityName("")
        province && dispatch(get(endpointResident + '/geo/province/' + province,
            res => {
                setCities(res.data.data);
                setFilteredCities(res.data.data);
            }
        ))
    }, [dispatch, province]);

    useEffect(() => {
        setDistrict("");
        setDistrictName("")
        city && dispatch(get(endpointResident + '/geo/city/' + city,
            res => {
                setDistricts(res.data.data);
                setFilteredDistricts(res.data.data);
            }
        ))
    }, [city, dispatch]);

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
        <Template 
            columns={columns}
            slice='building'
            getAction={getBuilding}
            deleteAction={deleteBuilding}
            filterVars={[province, city, district]}
            filters={[
                {
                    label: <p>{district ? "District: " + districtName : "District: All"}</p>,
                    delete: () => { setDistrict(""); },
                    onClick: () => { setType("district"); },
                    hidden: city === "",
                    hidex: district === "",
                    component: ModalComponent,
                },
                {
                    label: <p>{city ? "City: " + cityName : "City: All"}</p>,
                    onClick: () => { setType("city"); },
                    delete: () => { setCity("") },
                    hidden: province === "",
                    hidex: city === "",
                    component: ModalComponent,
                },
                {
                    label: <p>{province ? "Province: " + provinceName : "Province: All"}</p>,
                    onClick: () => { setType("province"); },
                    delete: () => { setProvince(""); },
                    hidex: province === "",
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
            onClickDetails={row => dispatch(getBuildingDetails(row, history, url))}
        />
    )
}

export default Component;
