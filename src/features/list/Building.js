import React, { useState, useEffect } from "react";
import { useRouteMatch, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FiPlus, FiSearch } from "react-icons/fi";

import Button from "../../components/Button";
import Modal from "../../components/Modal";
import Input from "../../components/Input";
import Link from "../../components/Link";
import Building from "../../components/cells/Building";
import {
  getBuilding,
  deleteMultipleBuilding,
  deleteBuilding,
  setSelected,
} from "../slices/building";
import { endpointResident } from "../../settings";
import { get } from "../slice";

import TemplateWithSelection from "./components/TemplateWithSelection";

const columns = [
  { Header: "ID", accessor: "id" },
  { Header: "Name", accessor: (row) => <Building id={row.id} data={row} /> },
  { Header: "Legal Name", accessor: "legal_name" },
  { Header: "Site ID", accessor: "code_name" },
  { Header: "Owner", accessor: "owner_name" },
  { Header: "Website", accessor: (row) => <Link>{row.website}</Link> },
];

function Component({ view }) {
  const [modalType, setType] = useState("province");

  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(5);

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

  const [multiActionRows, setMultiActionRows] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    dispatch(
      get(endpointResident + "/geo/province", (res) => {
        setProvinces(res.data.data);
        setFilteredProvinces(res.data.data);
      })
    );
  }, [dispatch]);

  useEffect(() => {
    setCity("");
    setCityName("");
    province &&
      dispatch(
        get(endpointResident + "/geo/province/" + province, (res) => {
          setCities(res.data.data);
          setFilteredCities(res.data.data);
        })
      );
  }, [dispatch, province]);

  useEffect(() => {
    setDistrict("");
    setDistrictName("");
    city &&
      dispatch(
        get(endpointResident + "/geo/city/" + city, (res) => {
          setDistricts(res.data.data);
          setFilteredDistricts(res.data.data);
        })
      );
  }, [city, dispatch]);

  useEffect(() => {
    const searched = (
      modalType === "province"
        ? provinces
        : modalType === "city"
        ? cities
        : districts
    ).filter((el) => el.name.toLowerCase().includes(search));
    let limited = searched.slice(0, limit);
    const restTotal = searched.length - limited.length;
    const valueLimit = 5;

    if (limited.length < searched.length) {
      limited.push({
        name:
          "load " + (restTotal > valueLimit ? valueLimit : restTotal) + " more",
        className: "load-more",
        restTotal: restTotal > valueLimit ? valueLimit : restTotal,
      });
    }

    modalType === "province"
      ? setFilteredProvinces(limited)
      : modalType === "city"
      ? setFilteredCities(limited)
      : setFilteredDistricts(limited);
  }, [cities, districts, modalType, provinces, search, limit]);

  useEffect(() => {
    if (search.length === 0) setLimit(5);
  }, [search]);

  function select(item) {
    modalType === "province"
      ? setProvince(item.id)
      : modalType === "city"
      ? setCity(item.id)
      : setDistrict(item.id);
    modalType === "province"
      ? setProvinceName(item.name)
      : modalType === "city"
      ? setCityName(item.name)
      : setDistrictName(item.name);
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
          {!search && (
            <button
              key="all"
              className="ListItem"
              onClick={() => {
                select("", "");
                toggleModal(false);
              }}
            >
              ALL
            </button>
          )}
          {modalType === "province" &&
            filteredProvinces.map((el) => (
              <button
                key={el.name}
                className={
                  el.className === "load-more"
                    ? "ListItem load-more"
                    : "ListItem"
                }
                onClick={() => {
                  if (el.className === "load-more") {
                    setLimit(limit + el.restTotal);
                    return;
                  }
                  select(el);
                  toggleModal(false);
                  setLimit(5);
                }}
              >
                {el.name}
              </button>
            ))}
          {modalType === "city" &&
            filteredCities.map((el) => (
              <button
                key={el.name}
                className={
                  el.className === "load-more"
                    ? "ListItem load-more"
                    : "ListItem"
                }
                onClick={() => {
                  if (el.className === "load-more") {
                    setLimit(limit + el.restTotal);
                    return;
                  }
                  select(el);
                  toggleModal(false);
                  setLimit(5);
                }}
              >
                {el.name}
              </button>
            ))}
          {modalType === "district" &&
            filteredDistricts.map((el) => (
              <button
                key={el.name}
                className={
                  el.className === "load-more"
                    ? "ListItem load-more"
                    : "ListItem"
                }
                onClick={() => {
                  if (el.className === "load-more") {
                    setLimit(limit + el.restTotal);
                    return;
                  }
                  select(el);
                  toggleModal(false);
                  setLimit(5);
                }}
              >
                {el.name}
              </button>
            ))}
        </div>
      </>
    );
  }

  return (
    <>
      <Modal
        isOpen={confirmDelete}
        disableHeader={true}
        btnDanger
        onClick={() => {
          const data = multiActionRows.map((el) => el.id);
          console.log(data);
          dispatch(deleteMultipleBuilding(data, history));
          setMultiActionRows([]);
          setConfirmDelete(false);
        }}
        toggle={() => {
          setConfirmDelete(false);
          setMultiActionRows([]);
        }}
        okLabel={"Delete"}
        cancelLabel={"Cancel"}
      >
        Are you sure you want to delete these buildings?
        <p style={{ paddingTop: "10px" }}>
          <ul>
            {multiActionRows.map((el) => (
              <li>{el?.name ? el.name : "nama"}</li>
            ))}
          </ul>
        </p>
      </Modal>
      <TemplateWithSelection
        view={view}
        pagetitle="Building List"
        columns={columns}
        slice="building"
        getAction={getBuilding}
        deleteAction={deleteBuilding}
        filterVars={[province, city, district]}
        selectAction={(selectedRows) => {
          setMultiActionRows(selectedRows);
        }}
        filters={[
          {
            label: (
              <p>{district ? "District: " + districtName : "District: All"}</p>
            ),
            delete: () => {
              setDistrict("");
            },
            onClick: () => {
              setType("district");
            },
            hidden: city === "",
            hidex: district === "",
            component: ModalComponent,
          },
          {
            label: <p>{city ? "City: " + cityName : "City: All"}</p>,
            onClick: () => {
              setType("city");
            },
            delete: () => {
              setCity("");
            },
            hidden: province === "",
            hidex: city === "",
            component: ModalComponent,
          },
          {
            label: (
              <p>{province ? "Province: " + provinceName : "Province: All"}</p>
            ),
            onClick: () => {
              setType("province");
            },
            delete: () => {
              setProvince("");
            },
            hidex: province === "",
            component: ModalComponent,
          },
        ]}
        renderActions={
          view
            ? null
            : (selectedRowIds, page) => {
                return [
                  <>
                    {Object.keys(selectedRowIds).length > 0 && (
                      <Button
                        color="Danger"
                        onClick={() => {
                          console.log(selectedRowIds);
                          setConfirmDelete(true);
                        }}
                        label="Delete"
                      />
                    )}
                  </>,
                  <Button
                    key="Add Building"
                    label="Add Building"
                    icon={<FiPlus />}
                    onClick={() => {
                      dispatch(setSelected({}));
                      history.push(url + "/add");
                    }}
                  />,
                ];
              }
        }
      />
    </>
  );
}

export default Component;
