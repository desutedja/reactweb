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
import CustomSetting from "./contents/CustomSetting";
import { endpointAdmin } from "../../../settings";
import { useParams, useHistory } from "react-router-dom";
import { get } from "../../slice";
import { setSelected, deleteBuilding} from "../../slices/building";
import {setting} from "./contents/data";
import Input from "../../../components/Input";
import { FiBell, FiMessageSquare } from "react-icons/fi";

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

const settings = {
  "Custom Setting" : [
    "created_on",
    "legal_name",
    "owner_name",
    "code_name",
    "email",
  ],
};

const tabs = [
  "Details",
  "Section",
  "Unit Type",
  "Unit",
  "Service",
  "Management",
  "Module",
  "Setting",
];
const tabsBM = ["Section", "Unit Type", "Unit", "Billing Service"];

function Component({ view, canUpdate, canAdd, canDelete }) {
  const [data, setData] = useState({});
  const [settingData, setSettingData] = useState({});
  const { auth } = useSelector((state) => state);
  console.log(auth.role, canAdd, canUpdate, canDelete);

  const [confirmDelete, setConfirmDelete] = useState(false);

  const [openEdit, setOpenEdit] = useState(false);
  const [selectedRow, setRow] = useState({});
  const [openLogo, setOpenLogo] = useState(false);
  const [openLW, setOpenLW] = useState(false);
  const [openSplash, setOpenSplash] = useState(false);

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
    <CustomSetting
      view={view}
      data={data}
      labels={settings}
      editModal={setOpenEdit}
      logoModal={setOpenLogo}
      logoWhiteModal={setOpenLW}
      splashModal={setOpenSplash}
      onDelete={() => setConfirmDelete(true)}
      canUpdate={auth.role === "bm" ? canUpdate : true}
      canAdd={auth.role === "bm" ? canAdd : true}
      canDelete={auth.role === "bm" ? canDelete : true}
    />
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
      <Modal
        width={"720px"}
        isOpen={openLogo}
        disableFooter={true}
        toggle={() => setOpenLogo(false)}
        title="Preview"
        subtitle="How the logo would look on mobile apps"
      >
        <div
          style={{
            width: "100%",
            height: "calc(780 / 1024 * 720px)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              height: "calc(164 / 1024 * 720px)",
              flex: 1,
              position: "absolute",
              right: 0,
              left: 0,
              zIndex: 99,
              backgroundColor: "#fafafaaa",
              fontWeight: "bold",
              display: "flex",
            }}
          >
            <img
              style={{
                height: "35px",
                top: "45px",
                left: "30px",
                position: "absolute",
              }}
              src={require("../../../assets/yipy-logo-color.png")}
              alt="clinklogo"
            />
            <FiMessageSquare
              size="45"
              style={{ top: "45px", position: "absolute", right: "140px" }}
            />
            <FiBell
              size="45"
              style={{ top: "45px", position: "absolute", right: "45px" }}
            />
          </div>
          <img
            style={{
              height: "100%",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              marginRight: "-50%",
            }}
            // src={data.content_image}
            src="https://api-dev.yipy.id/yipy-assets/asset-storage/img/F34D997E4CE07657D5A0EC38304E6BE8.png"
            alt="content_image"
          />
        </div>
      </Modal>
      <Modal
        width={"720px"}
        isOpen={openLW}
        disableFooter={true}
        toggle={() => setOpenLW(false)}
        title="Preview"
        subtitle="How the logo would look on mobile apps"
      >
        <div
          style={{
            width: "100%",
            height: "calc(780 / 1024 * 720px)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              height: "calc(164 / 1024 * 720px)",
              flex: 1,
              position: "absolute",
              right: 0,
              left: 0,
              zIndex: 99,
              backgroundColor: "#fafafaaa",
              fontWeight: "bold",
              display: "flex",
            }}
          >
            <img
              style={{
                height: "35px",
                top: "45px",
                left: "30px",
                position: "absolute",
              }}
              src={require("../../../assets/yipy-logo-white.png")}
              alt="clinklogo"
            />
            <FiMessageSquare
              size="45"
              style={{ top: "45px", position: "absolute", right: "140px" }}
            />
            <FiBell
              size="45"
              style={{ top: "45px", position: "absolute", right: "45px" }}
            />
          </div>
          <img
            style={{
              height: "100%",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              marginRight: "-50%",
            }}
            // src={data.content_image}
            src="https://api-dev.yipy.id/yipy-assets/asset-storage/img/F34D997E4CE07657D5A0EC38304E6BE8.png"
            alt="content_image"
          />
        </div>
      </Modal>
      <Modal
        width={"720px"}
        isOpen={openSplash}
        disableFooter={true}
        toggle={() => setOpenSplash(false)}
        title="Preview"
        subtitle="How the logo would look on mobile apps"
      >
        <div
          style={{
            width: "100%",
            height: "calc(614 / 1024 * 720px)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              height: "calc(164 / 1024 * 720px)",
              flex: 1,
              position: "absolute",
              right: 0,
              left: 0,
              zIndex: 99,
              backgroundColor: "#fafafaaa",
              fontWeight: "bold",
              display: "flex",
            }}
          >
          </div>
          <img
            style={{
              height: "100%",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              marginRight: "-50%",
            }}
            // src={data.content_image}
            alt="content_image"
          />
        </div>
      </Modal>
      <Modal
        width="540px"
        isOpen={openEdit}
        toggle={() => setOpenEdit(false)}
        title="Edit Custom Setting"
        okLabel="Save"
        onClick={() => {
            dispatch(
                setSelected(
                  // {
                  //   building_id: selected.id,
                  //   section_type: sectionType
                  //     ? sectionType
                  //     : selectedRow.section_type,
                  //   section_name: sectionName
                  //     ? sectionName
                  //     : selectedRow.section_name,
                  // },
                  // selectedRow.id
                )
              );
          setOpenEdit(false);
          setRow({});
        }}
      >
        <form>
          <Input
            label="Main Color"
            // inputValue={
            //   selectedRow.section_name
            //     ? toSentenceCase(selectedRow.section_name)
            //     : sectionName
            // }
            // setInputValue={setSectionName}
          />
          <Input
            label="Second Color"
            // inputValue={
            //   selectedRow.section_type ? selectedRow.section_type : sectionType
            // }
            // setInputValue={setSectionType}
            // type="select"
            // options={sectionTypes}
          />
          <Input
            label="Logo URL"
            type="file"
            // inputValue={
            //   selectedRow.section_type ? selectedRow.section_type : sectionType
            // }
            // setInputValue={setSectionType}
            // type="select"
            // options={sectionTypes}
          />
          <Input
            label="Logo White URL"
            type="file"
            // inputValue={
            //   selectedRow.section_type ? selectedRow.section_type : sectionType
            // }
            // setInputValue={setSectionType}
            // type="select"
            // options={sectionTypes}
          />
          <Input
            label="Splash Screen"
            type="file"
            // inputValue={
            //   selectedRow.section_type ? selectedRow.section_type : sectionType
            // }
            // setInputValue={setSectionType}
            // type="select"
            // options={sectionTypes}
          />
          <div
            style={{
              display: "flex",
              marginTop: 16,
              justifyContent: "center",
            }}
          ></div>
        </form>
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
