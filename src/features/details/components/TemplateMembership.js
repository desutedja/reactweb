import React, { useState, useEffect, useCallback } from "react";
import { FiGlobe, FiPhone, FiMail, FiSearch, FiUser, FiCheck } from "react-icons/fi";
import { RiStore2Line } from "react-icons/ri";

import Table from "../../../components/Table";

import { useDispatch, useSelector } from "react-redux";
import Pill from "../../../components/Pill";

import Loading from "../../../components/Loading";
import Tab from "../../../components/Tab";
import Breadcrumb from "../../../components/Breadcrumb";
import { toSentenceCase,dateFormatter,inputDateTimeFormatter24 } from "../../../utils";

import Input from "../../../components/Input";
import Button from "../../../components/Button";
import Modal from '../../../components/Modal';

import {
  endpointAdmin,
} from "../../../settings";

import { post, get } from "../../slice";
import { AiOutlineBorderBottom } from "react-icons/ai";

const columnsUnit = [
  { Header: "ID", accessor: "id" },
  { Header: "Resident", accessor: "resident_name" },
  { Header: "Facility", accessor: "facility_name" },
  { Header: "Card Number", accessor: "membership_card_number" },
  { Header: "Tap In Time", accessor: (row) => row.created_on ? inputDateTimeFormatter24(row.created_on) : "-" },
  { Header: "Status", accessor: "status"}
];

function Component({
  image,
  title,
  transparent,
  status,
  resident,
  labels,
  contents,
  activeTab,
  pagetitle = "",
  imageTitle = "",
  facility,
  loading = true,
}) {

  const data = {
    "data": [
      {
        "id": 1,
        "resident_name":"User Satu",
        "facility_name": "Gym",
        "card_number": "1231263190",
        "created_on": "2023-08-01"
      },
      {
        "id": 2,
        "resident_name":"User Dua",
        "facility_name": "Club House",
        "card_number": "7673724616",
        "created_on": "2023-09-01"
      }
    ],
    "total_items": 2,
    "filtered_page": 1,
    "total_pages": 1,
    "filtered_item": 10
  };

  let dispatch = useDispatch();

  const [dtResident, setResident] = useState();
  const [validStatus, setValidStatus] = useState();
  const [caption, setCaption] = useState();
  const [data2, setData] = useState(data);
  const [refresh, SetRefresh] = useState();
  const [search, setSearch] = useState(false);
  const [facilityValue, setFacility] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [facilityCard, setFacilityCard] = useState();
  const [checkStatus, setCheckStatus] = useState();

  function handleKeyDown(event) {
    if (event.nativeEvent.key === 'Enter') {
      // Lakukan sesuatu saat tombol "Enter" ditekan
  
      var inputField = document.getElementById("search");
      let status = "";
  
      // Memeriksa apakah elemen input ada
      if (inputField) {
          inputField.select();
          dispatch(
            post(endpointAdmin + "/access",{
              facility_id : parseInt(facilityValue),
              membership_card_number : search,
            }, (res) => {
              
              if (res.data.message.includes("error") === false) {
                setResident(res.data.data)
                let sts = res.data.data.Status == "check-out" ? "check-in" : "check-out"
                setCheckStatus(sts);

                dispatch(
                  get(endpointAdmin + "/access/log", (res) => {
                    setData(res.data);
                  })
                );
                setValidStatus("VALID");
                setCaption("Kartu dapat digunakan pada fasilitas ini");
                
              }else{
                setValidStatus("INVALID");
                setCaption(res.data.data);
                setResident("");
              }
            })
          );
      }
    }else{
      setValidStatus("");
      setResident("");
    }
  }

  useEffect(() => {
    dispatch(
      get(endpointAdmin + "/access/log", (res) => {
        setData(res.data);
      })
    );
  }, [refresh]);

  const [imgLoading, setImgLoading] = useState(true);

  return (
    <>
    <Modal
        title={checkStatus}
        subtitle={checkStatus + " facility"}
        isOpen={openModal}
        toggle={() => setOpenModal(false)}
        cancelLabel="Cancel"
        okLabel={checkStatus}
        onClickSecondary={() => {
          setOpenModal(false);
        }}
        onClick={() => {
          dispatch(
            post(endpointAdmin + "/access/log",{
              resident_id : parseInt(dtResident.resident_id),
              facility_id : parseInt(facilityValue),
              membership_card_number : search,
              card_number : facilityCard,
              status : checkStatus 
            }, (res) => {
              SetRefresh(true);
              setOpenModal(false);
              setValidStatus("");
              setResident("");
              setSearch("");
            })
          );
        }}
      >
      <>
        <Input
          compact
          fullwidth={true}
          inputValue={search}
          disabled={true}
        />
        <br/>
        <Input
          placeholder={"Tap Card Here"}
          label="facility_card"
          compact
          fullwidth={true}
          inputValue={facilityCard}
          setInputValue={setFacilityCard}
        />
      </>
    </Modal>
      <Breadcrumb title={title ? title : "Details"} />
      <h2 className="PageTitle">{pagetitle}</h2>
      <Loading loading={loading}>
        <div
          style={{
            display: "flex",
            flex: 1,
            overflow: "scroll",
          }}
        >
          <div className="column">            
            {image && (
              <div
                className="Container"
                style={{
                  flexDirection: "column",
                  maxWidth: 360,
                }}
              >

                  <Input type="select" label="Facility" options={facility} setInputValue={(e) => {
                    setFacility(e)
                  }} />
                  <br/>
                
                  <Input
                    placeholder={"Tap the card on the card reader"}
                    label="search"
                    compact
                    fullwidth={true}
                    inputValue={search}
                    setInputValue={setSearch}
                    onKeyDown={handleKeyDown}
                    
                  />
                  <br/>

                { validStatus && search && (
                  <div>
                  <div className="row">
                    <div className="col reason-container" style={{border: validStatus? validStatus=="VALID"?"1px solid #18b368":"1px solid #e12029" :"none", backgroundColor: validStatus? validStatus=="VALID"?"#eefff7":"#fde9ec" :"#f3f3fa"}}>
                      <p style={{ fontSize: "14px", textAlign:"center", fontWeight:600, color:validStatus? validStatus=="VALID"?"#18b368":"#e12029":"black" }}>{toSentenceCase(validStatus)}</p>
                      <p style={{ fontSize: "12px", textAlign:"center", color:validStatus? validStatus=="VALID"?"#18b368":"#e12029":"black" }}>{toSentenceCase(caption)}</p>
                    </div>
                  </div>
                  <br/>
                  </div>
                )}
                

                {imgLoading && (
                  <div
                    style={{
                      height: 300,
                      objectFit: "cover",
                      width: "100%",
                      marginBottom: 16,
                    }}
                    className="shine"
                  />
                )}
                <img
                  alt="Avatar"
                  src={
                    dtResident && dtResident.photo !== ""
                      ? dtResident.photo
                      : require("../../../assets/fallback.jpg")
                  }
                  style={{
                    height: imgLoading ? 0 : 300,
                    objectFit: "cover",
                    width: "100%",
                    marginBottom: 16,
                  }}
                  onLoad={() => setImgLoading(false)}
                  onError={() => setImgLoading(false)}
                />
                {dtResident && (
                  <div className="row">
                    <div className="col d-flex">
                      <h5 style={{marginLeft:10}}>{dtResident.resident_name}</h5>
                    </div>
                  </div>
                )}

               { validStatus == "VALID" && dtResident && (
                <div className="row" style={{padding:"0px 10px"}}>
                  <div className="col d-flex" style={{borderTop: "1px solid #e9e9e9", padding:"8px 0 0 0", marginTop:8}}>
                    <div style={{color: "grey", width: "165px", textAlign: "center", fontSize:"12px"}}>Card Number</div>
                    <div style={{color: "grey", width: "165px", textAlign: "center", fontSize:"12px"}}>Package & Period</div>
                    <div style={{color: "grey", width: "165px", textAlign: "center", fontSize:"12px"}}>Valid Thru</div>
                  </div>

                  <div className="col d-flex" style={{padding:"0px"}}>
                    <div style={{color: "black", width: "165px", textAlign: "center", fontSize:"12px"}}>{dtResident.membership_card_number}</div>
                    <div style={{color: "black", width: "165px", textAlign: "center", fontSize:"12px"}}>Platinum - 30 Day</div>
                    <div style={{color: "black", width: "165px", textAlign: "center", fontSize:"12px"}}>13 Okt 2023</div>
                  </div>

                  <div className="col d-flex" style={{padding:"0 8px", margin:"16px 0px 10px 0px"}}>
                    <button onClick={() => {
                        setOpenModal(true);
                        setTimeout(function (){
                          document.getElementById('facility_card').focus();
                          if (checkStatus == "check-out") {
                            setFacilityCard(search);
                            setSearch(dtResident.membership_card_number);
                            document.getElementById('facility_card').disabled = true;
                          }
                        }, 150);
                        }
                        } style={{width: "100%", textTransform:"uppercase", backgroundColor: '#e12029',borderRadius: 11,fontWeight: 700,fontSize:16,padding:12,color:"white",}}>{checkStatus}</button>
                  </div>
                </div>
                )}

              </div>
            )}
          </div>

          <div
            className={transparent ? "Container-transparent" : "Container"}
            style={{
              flex: 2,
            }}
          >
            {/* <Table
              titleList={"Log Activity"}
              totalItems={"10"}
              noContainer={true}
              columns={columnsUnit}
              data={data2.data}
              loading={false}
              pageCount={"10"}
              fetchData={useCallback(
                () => {
                  dispatch(
                    get(endpointAdmin + "/access/log", (res) => {
                      setData(res.data);
                      console.log("DATA:", data2)
                    })
                  );
                  // eslint-disable-next-line react-hooks/exhaustive-deps
                },
                [dispatch]
              )}
              filters={[]}
            /> */}
            <Tab labels={labels} contents={contents} activeTab={activeTab} />
          </div>
        </div>
      </Loading>
    </>
  );
}

export default Component;
