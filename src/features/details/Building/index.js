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
import { get, put, setInfo } from "../../slice";
import { setSelected, deleteBuilding, refresh, startAsync, stopAsync} from "../../slices/building";
import {setting} from "./contents/data";
import Input from "../../../components/Input";
import { FiBell, FiMessageSquare } from "react-icons/fi";
import { toSentenceCase } from "../../../utils";

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
    "main_color",
    "secondary_color",
    "logo_url",
    "logo_url_white",
    "splash_background",
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
  const [mainColor, setMainColor] = useState();
  const [secondaryColor, setSecondaryColor] = useState();
  const [logoURL, setLogoURL] = useState();
  const [logoURLWhite, setlogoURLWhite] = useState();
  const [splashScreen, setSplashScreen] = useState();

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
      data={settingData}
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

  useEffect(() => {

  //   dispatch(
  //     get(endpointAdmin + "/building/settings?building_id=" + id, (res) => {

  //       const body = res.data;
  //       console.log(body);
        
  //       if (body.data == null) { 
  //         dispatch(
  //           setInfo({
  //             color: "danger",
  //             message: `Custom setting building is not set`,
  //           })
  //         );       

  //       }else {
  //         setSettingData(res.data.data);
  //         dispatch(setSelected(res.data.data));

  //       } 
  //     },
  //   )
  // );
    dispatch(
      get(endpointAdmin + "/building/settings?building_id=" + id, (res) => {
        setSettingData(res.data.data);
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
              src={settingData.logo_url}
              alt="logo"
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
        subtitle="How the logo white would look on mobile apps"
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
              src={settingData.logo_url_white}
              alt="logo_white"
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
        subtitle="How the splash screen would look on mobile apps"
      >
        <div
          style={{
            width: "100%",
            height: "calc(614 / 1024 * 720px)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <img
            style={{
              height: "100%",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              marginRight: "-50%",
            }}
            src={settingData.splash_background}
            alt="splash_screen"
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
          dispatch(startAsync());
            dispatch(
                put(endpointAdmin + "/building/settings?building_id",
                  {
                    building_id: settingData.building_id,
                    main_color: mainColor
                      ? mainColor
                      : settingData.main_color,
                    secondary_color: secondaryColor
                      ? secondaryColor
                      : settingData.secondary_color,
                    logo_url: logoURL
                      ? logoURL
                      : settingData.logo_url,
                    logo_url_white: logoURLWhite
                      ? logoURLWhite
                      : settingData.logo_url_white,
                    splash_background: splashScreen
                      ? splashScreen
                      : settingData.splash_background,
                  },
                  (res) => {
                    dispatch(refresh());
            
                    dispatch(
                      setInfo({
                        color: "success",
                        message: "Custom setting building has been updated.",
                      })
                    );
            
                    dispatch(stopAsync());
                  },
                  (err) => {
                    dispatch(stopAsync());
                  }
                )
              );
          setOpenEdit(false);
          setRow({});
        }}
      >
        <form>
          <Input
            label="Main Color"
            inputValue={
              settingData.main_color
                ? toSentenceCase(settingData.main_color)
                : mainColor
            }
            setInputValue={setMainColor}
          />
          <Input
            label="Second Color"
            inputValue={
              settingData.secondary_color
                ? toSentenceCase(settingData.secondary_color)
                : secondaryColor
            }
            setInputValue={setSecondaryColor}
          />
          <Input
            label="Logo URL"
            type="file"
            inputValue={
              settingData.logo_url
                ? settingData.logo_url
                : logoURL
            }
            setInputValue={setLogoURL}
          />
          <Input
            label="Logo White URL"
            type="file"
            inputValue={
              settingData.logo_url_white
                ? settingData.logo_url_white
                : logoURLWhite
            }
            setInputValue={setlogoURLWhite}
          />
          <Input
            label="Splash Screen"
            type="file"
            inputValue={
              settingData.splash_background
                ? settingData.splash_background
                : splashScreen
            }
            setInputValue={setSplashScreen}
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
