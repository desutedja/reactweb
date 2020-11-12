import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Detail from "../components/Detail";
import Template from "../components/Template";

import Modal from "../../../components/Modal";
import Unit from "./contents/Unit";
import UnitType from "./contents/UnitType";
import Section from "./contents/Section";
import Service from "./contents/Service";
import Management from "./contents/Management";
import Module from "./contents/Module";
import { endpointAdmin } from "../../../settings";
import { useParams, useHistory } from "react-router-dom";
import { get } from "../../slice";
import { setSelected, deleteBuilding } from "../../slices/building";

const labels = {
  Information: [
    "id",
    "created_on",
    "legal_name",
    "owner_name",
    "code_name",
    "email",
  ],
  Address: [
    "address",
    "district_name",
    "city_name",
    "province_name",
    "zipcode",
  ],
  Others: ["max_units", "max_floors", "max_sections"],
};

const tabs = [
  "Details",
  "Section",
  "Unit Type",
  "Unit",
  "Service",
  "Management",
  "Module",
];
const tabsBM = ["Section", "Unit Type", "Unit", "Billing Service"];

function Component({ view, canUpdate, canAdd, canDelete }) {
  const [data, setData] = useState({});
  const { auth } = useSelector((state) => state);
  console.log(auth.role, canAdd, canUpdate, canDelete);

  const [confirmDelete, setConfirmDelete] = useState(false);

  let dispatch = useDispatch();
  let history = useHistory();
  let { id } = useParams();

  const contents = [
    <Detail
      view={view}
      data={data}
      labels={labels}
      onDelete={() => setConfirmDelete(true)}
      canUpdate={auth.role === "bm" ? canUpdate : true}
      canAdd={auth.role === "bm" ? canAdd : true}
      canDelete={auth.role === "bm" ? canDelete : true}
    />,
    <Section
      view={view}
      canUpdate={auth.role === "bm" ? canUpdate : true}
      canAdd={auth.role === "bm" ? canAdd : true}
      canDelete={auth.role === "bm" ? canDelete : true}
    />,
    <UnitType
      view={view}
      canUpdate={auth.role === "bm" ? canUpdate : true}
      canAdd={auth.role === "bm" ? canAdd : true}
      canDelete={auth.role === "bm" ? canDelete : true}
    />,
    <Unit
      view={view}
      canUpdate={auth.role === "bm" ? canUpdate : true}
      canAdd={auth.role === "bm" ? canAdd : true}
      canDelete={auth.role === "bm" ? canDelete : true}
    />,
    <Service
      view={view}
      canUpdate={auth.role === "bm" ? canUpdate : true}
      canAdd={auth.role === "bm" ? canAdd : true}
      canDelete={auth.role === "bm" ? canDelete : true}
    />,
    <Management
      view={view}
      canUpdate={auth.role === "bm" ? canUpdate : true}
      canAdd={auth.role === "bm" ? canAdd : true}
      canDelete={auth.role === "bm" ? canDelete : true}
    />,
    <Module
      view={view}
      canUpdate={auth.role === "bm" ? canUpdate : true}
      canAdd={auth.role === "bm" ? canAdd : true}
      canDelete={auth.role === "bm" ? canDelete : true}
    />,
  ];
  const contentsBM = [
    <Section
      canUpdate={auth.role === "bm" ? canUpdate : true}
      canAdd={auth.role === "bm" ? canAdd : true}
      canDelete={auth.role === "bm" ? canDelete : true}
    />,
    <UnitType
      canUpdate={auth.role === "bm" ? canUpdate : true}
      canAdd={auth.role === "bm" ? canAdd : true}
      canDelete={auth.role === "bm" ? canDelete : true}
    />,
    <Unit
      canUpdate={auth.role === "bm" ? canUpdate : true}
      canAdd={auth.role === "bm" ? canAdd : true}
      canDelete={auth.role === "bm" ? canDelete : true}
    />,
    <Service
      canUpdate={auth.role === "bm" ? canUpdate : true}
      canAdd={auth.role === "bm" ? canAdd : true}
      canDelete={auth.role === "bm" ? canDelete : true}
    />,
  ];

  useEffect(() => {
    dispatch(
      get(endpointAdmin + "/building/details/" + id, (res) => {
        setData(res.data.data);
        dispatch(setSelected(res.data.data));
      })
    );
  }, [id, dispatch]);

  return (
    <>
      <Modal
        isOpen={confirmDelete}
        disableHeader={true}
        btnDanger
        onClick={() => dispatch(deleteBuilding(data, history))}
        toggle={() => setConfirmDelete(false)}
        okLabel={"Delete"}
        cancelLabel={"Cancel"}
      >
        Are you sure you want to delete building <b>{data.name}</b>?
      </Modal>
      <Template
        canUpdate={auth.role === "bm" ? canUpdate : true}
        canAdd={auth.role === "bm" ? canAdd : true}
        canDelete={auth.role === "bm" ? canDelete : true}
        activeTab={history.location.state ? history.location.state.tab : 0}
        image={auth.role === "sa" && data.logo}
        title={data.name}
        website={data.website}
        phone={data.phone}
        loading={!data.id}
        labels={auth.role === "sa" ? tabs : tabsBM}
        contents={auth.role === "sa" ? contents : contentsBM}
      />
    </>
  );
}

export default Component;
