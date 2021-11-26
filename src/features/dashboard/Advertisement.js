import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

import { endpointAds } from "../../settings";
import LineCharts from "./Components/LineCharts";
import Piecharts from "./Components/PieCharts";
import ClinkLoader from "../../components/ClinkLoader";
import moment from "moment";

import "./style.css";
import { get } from "../slice";
import Tab from "../../components/Tab";
import { useDispatch } from "react-redux";
import { toSentenceCase, toThousand, getDatesRange } from "../../utils";
import {
  Button,
  ButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import { FiSearch } from "react-icons/fi";
import SummaryItem from "./Components/SummaryItem";
import { downloadAdsReport } from "../slices/ads";
import Loading from "../../components/Loading";
const monthConst = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const CustomLabelList = (props) => {
  const { x, y, stroke, value } = props;
  return (
    <text textAnchor="right" dy={20} dx={10} x={x} y={y} fill={stroke}>
      {value}
    </text>
  );
};
const tabs = ["Pop-up", "Banner"];

const colorList = [
  "#DDF2F6",
  "#F7DFED",
  "#DDF6F2",
  "#FBF7D7",
  "#FBD9D7",
  "#E1F3E4",
  "#E3E2F9",
];

function Component() {
  const { auth } = useSelector((state) => state);
  const { user, role } = auth;
  const { group } = user;
  const [timeline, setTimeline] = useState([]);

  const [selectedMonth, setSelectedMonth] = useState("Time");
  const [selectedFilter, setSelectedFilter] = useState(0);
  const [adsData, setAdsData] = useState([]);
  const [type, setType] = useState("pop-up");
  const [selectedId, setSelectedId] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [dataKeys, setDataKeys] = useState([]);

  const [impressionDetail, setImpressionDetail] = useState([
    { name: "", value: 1 },
    { name: "", value: 2 },
  ]);
  const [platformDetail, setPlatformDetail] = useState([
    { name: "", value: 1 },
    { name: "", value: 2 },
  ]);
  const [ageDetail, setAgeDetail] = useState([
    { name: "", value: 1 },
    { name: "", value: 2 },
  ]);
  const [genderDetail, setGenderDetail] = useState([
    { name: "", value: 1 },
    { name: "", value: 2 },
  ]);
  const [buildingDetail, setBuildingDetail] = useState([
    { name: "", value: 1 },
    { name: "", value: 2 },
  ]);
  const [occupationDetail, setOccupationDetail] = useState([
    { name: "", value: 1 },
    { name: "", value: 2 },
  ]);
  const [searchValue, setSearchValue] = useState("");
  const [searchAdvertiser, setSearchAdvertiser] = useState("");
  const [campaigns, setCampaigns] = useState([]);
  const [popup, setPopup] = useState("");
  const [popups, setPopups] = useState([]);
  const [banner, setBanner] = useState("");
  const [banners, setBanners] = useState([]);
  const [advertiser, setAdvertiser] = useState("");
  const [advertisers, setAdvertisers] = useState([]);
  const [loadingPopup, setLoadingPopup] = useState(false);
  const [loadingBanner, setLoadingBanner] = useState(false);
  const [loadingAdvertiser, setLoadingAdvertiser] = useState(false);
  const [summary, setSummary] = useState([
    {
      label: "Impression",
      icon:
        "https://api.yipy.id/yipy-assets/asset-storage/img/76695B6C63524E46A289758114CF2609.png",
      data: 0,
    },
    {
      label: "Views",
      icon:
        "https://api.yipy.id/yipy-assets/asset-storage/img/C514A1D0A34EF8A8852CD417DA4F2BAC.png",
      data: 0,
    },
    {
      label: "Click",
      icon:
        "https://api.yipy.id/yipy-assets/asset-storage/img/9EC3211E8CCDA375F28D2166BCD066C1.png",
      data: 0,
    },
    {
      label: "Download Report",
      data:
        "https://api.yipy.id/yipy-assets/asset-storage/img/F8F140A85BA88A1B61C6855ECD9E04E6.png",
    },
  ]);

  const [limitPopup, setLimitPopup] = useState(5);
  const [limitAdvertiser, setLimitAdvertiser] = useState(5);
  const [limitBanner, setLimitBanner] = useState(5);
  const data = [
    { month: "Jan 2020", view: 1000, click: 700, amt: 2400 },
    { month: "Feb 2020", view: 200, click: 200, amt: 2400 },
    { month: "Mar 2020", view: 600, click: 320, amt: 2400 },
    { month: "Apr 2020", view: 100, click: 100, amt: 2400 },
    { month: "May 2020", view: 400, click: 240, amt: 2400 },
    { month: "Jun 2020", view: 700, click: 433, amt: 2400 },
    { month: "Jul 2020", view: 400, click: 142, amt: 2400 },
    { month: "Aug 2020", view: 250, click: 240, amt: 2400 },
    { month: "Sep 2020", view: 222, click: 122, amt: 2400 },
    { month: "Oct 2020", view: 423, click: 152, amt: 2400 },
    { month: "Nov 2020", view: 300, click: 300, amt: 2400 },
    { month: "Dec 2020", view: 700, click: 680, amt: 2400 },
  ];

  const dataImpression = [
    { name: "View", value: 400 },
    { name: "Click", value: 300 },
  ];
  const dataPlatform = [
    { name: "Android", value: 200 },
    { name: "iOS", value: 50 },
  ];
  const dataAge = [
    { name: "10", value: 200 },
    { name: "15", value: 50 },
    { name: "20", value: 50 },
    { name: "25", value: 50 },
    { name: "30", value: 50 },
  ];
  const dataGender = [
    { name: "Male", value: 200 },
    { name: "Female", value: 50 },
  ];
  const dataBuilding = [
    { name: "MTHR", value: 100 },
    { name: "Paragon Village", value: 120 },
  ];
  const dataOccupation = [
    { name: "Professional", value: 200 },
    { name: "Student", value: 150 },
    { name: "Housewife", value: 250 },
  ];

  const summaryData = [
    {
      label: "Impression",
      icon:
        "https://api.yipy.id/yipy-assets/asset-storage/img/76695B6C63524E46A289758114CF2609.png",
      data: 100000,
    },
    {
      label: "Views",
      icon:
        "https://api.yipy.id/yipy-assets/asset-storage/img/C514A1D0A34EF8A8852CD417DA4F2BAC.png",
      data: 100000,
    },
    {
      label: "Click",
      icon:
        "https://api.yipy.id/yipy-assets/asset-storage/img/9EC3211E8CCDA375F28D2166BCD066C1.png",
      data: 100000,
    },
    {
      label: "Download Report",
      data:
        "https://api.yipy.id/yipy-assets/asset-storage/img/F8F140A85BA88A1B61C6855ECD9E04E6.png",
    },
  ];

  const audiencesFilter = [
    "",
    "platform",
    "gender",
    "age",
    "occupation",
    "building",
  ];

  let dispatch = useDispatch();
  const history = useHistory();
  const [dropdownOpen, setOpen] = useState(false);

  const toggle = () => setOpen(!dropdownOpen);

  const handleReport = (data, withTimeline = true) => {
    setSummary([
      {
        label: "Impression",
        icon:
          "https://api.yipy.id/yipy-assets/asset-storage/img/76695B6C63524E46A289758114CF2609.png",
        data: data.summary.total_repeated_impression,
      },
      {
        label: "Views",
        icon:
          "https://api.yipy.id/yipy-assets/asset-storage/img/C514A1D0A34EF8A8852CD417DA4F2BAC.png",
        data: data.summary.total_repeated_view,
      },
      {
        label: "Click",
        icon:
          "https://api.yipy.id/yipy-assets/asset-storage/img/9EC3211E8CCDA375F28D2166BCD066C1.png",
        data: data.summary.total_repeated_click,
      },
      {
        label: "Download Report",
        data:
          "https://api.yipy.id/yipy-assets/asset-storage/img/F8F140A85BA88A1B61C6855ECD9E04E6.png",
      },
    ]);

    if (withTimeline) {
      const startOfYear = new Date(new Date().getFullYear(), 0, 1);
      const endOfYear = new Date(new Date().getFullYear(), 12, 0);
      const monthsRange = getDatesRange(
        new Date(startOfYear),
        new Date(endOfYear),
        "months"
      );
      const timelineFormatted = monthsRange.map((date) => {
        const month = moment(date).format("MMM") + " ";
        const monthNumber = moment(date).format("M");
        const year = moment(date).format("YYYY");
        const adsData = data.timeline.filter(
          (el) =>
            parseInt(el.month) === parseInt(monthNumber) &&
            parseInt(el.year) === parseInt(year)
        )[0];
        if (typeof adsData === "undefined") {
          return {
            m: parseInt(monthNumber),
            y: parseInt(year),
            month: month + year,
            view: 0,
            click: 0,
            empty: true,
          };
        } else {
          return {
            m: parseInt(monthNumber),
            y: parseInt(year),
            month: month + year,
            view: adsData.total_repeated_view,
            click: adsData.total_repeated_click,
            empty: false,
          };
        }
      });
      setTimeline(timelineFormatted);
    }
    Object.keys(data.detail).map((key) => {
      switch (key) {
        case "ages":
          setAgeDetail([
            ...data.detail[key].map((item) => ({
              name: item.name,
              value: item.repeated_value,
            })),
          ]);
          break;
        case "occupations":
          setOccupationDetail([
            ...data.detail[key].map((item) => ({
              name: item.name,
              value: item.repeated_value,
            })),
          ]);
          break;
        case "genders":
          setGenderDetail([
            ...data.detail[key].map((item) => ({
              name: item.name,
              value: item.repeated_value,
            })),
          ]);
          break;
        case "platforms":
          setPlatformDetail([
            ...data.detail[key].map((item) => ({
              name: item.name,
              value: item.repeated_value,
            })),
          ]);
          break;
        case "impressions":
          setImpressionDetail([
            ...data.detail[key].map((item) => ({
              name: item.name,
              value: item.repeated_value,
            })),
          ]);
          break;
        case "buildings":
          setBuildingDetail([
            ...data.detail[key].map((item) => ({
              name: item.name,
              value: item.repeated_value,
            })),
          ]);
          break;
      }
    });
  };

  useEffect(() => {
    setLoadingPopup(true);
    setLoadingBanner(true);
    if (group !== "vas_advertiser") {
      setLoadingAdvertiser(true);

      dispatch(
        get(
          endpointAds +
            "/management/ads/list/advertiser?" +
            "limit=" +
            limitAdvertiser,
          (res) => {
            setAdvertisers(res.data.data.items);
            setLoadingAdvertiser(false);
          },
          (err) => {
            console.log("FAILED GET LIST ADVERTISER :", err);
            setLoadingAdvertiser(false);
          }
        )
      );
    }
    dispatch(
      get(
        endpointAds +
          "/management/ads?" +
          "limit=" +
          limitPopup +
          "&appear_as=popup&published=1&for=report",
        (res) => {
          setPopups(res.data.data.items);
          setLoadingPopup(false);
        },
        (err) => {
          console.log("FAILED GET LIST ADVERTISER :", err);
          setLoadingPopup(false);
        }
      )
    );
    dispatch(
      get(
        endpointAds +
          "/management/ads?" +
          "limit=" +
          limitBanner +
          "&appear_as=banner&published=1&for=report",
        (res) => {
          setBanners(res.data.data.items);
          setLoadingBanner(false);
        },
        (err) => {
          console.log("FAILED GET LIST ADVERTISER :", err);
          setLoadingBanner(false);
        }
      )
    );

    dispatch(
      get(
        endpointAds + "/management/ads/report",
        (res) => {
          const data = res.data.data;
          handleReport(data);
        },
        (err) => {
          console.log("FAILED GET LIST REPORT :", err);
        }
      )
    );
    // get(endpointAds + "/management/ads/report/overview", (res) => {
    //   setAdsData(res.data.data);
    // })
  }, [dispatch]);

  useEffect(() => {
    console.log(type);
    if (type === "pop-up") {
      setLoadingPopup(true);
      dispatch(
        get(
          endpointAds +
            "/management/ads?" +
            "limit=" +
            limitPopup +
            "&appear_as=popup&published=1&for=report" +
            "&search=" +
            searchValue,
          (res) => {
            setPopups(res.data.data.items);
            setLoadingPopup(false);
          },
          (err) => {
            console.log("FAILED GET LIST ADVERTISER :", err);
            setLoadingPopup(false);
          }
        )
      );
    }
    if (type == "banner") {
      setLoadingBanner(true);
      dispatch(
        get(
          endpointAds +
            "/management/ads?" +
            "limit=" +
            limitBanner +
            "&appear_as=banner&published=1&for=report" +
            "&search=" +
            searchValue,
          (res) => {
            setBanners(res.data.data.items);
            setLoadingBanner(false);
          },
          (err) => {
            console.log("FAILED GET LIST ADVERTISER :", err);
            setLoadingBanner(false);
          }
        )
      );
    }
  }, [searchValue, type, limitBanner, limitPopup]);

  useEffect(() => {
    if (group === "vas_advertiser") {
      return;
    }
    setLoadingAdvertiser(true);
    dispatch(
      get(
        endpointAds +
          "/management/ads/list/advertiser?" +
          "limit=" +
          limitAdvertiser +
          "&search=" +
          searchAdvertiser,
        (res) => {
          setAdvertisers(res.data.data.items);
          setLoadingAdvertiser(false);
        },
        (err) => {
          console.log("FAILED GET LIST ADVERTISER :", err);
          setLoadingAdvertiser(false);
        }
      )
    );
  }, [searchAdvertiser]);

  // useEffect(() => {
  //   const idList = selectedId.map((el) => el.id).join(",");
  //   if (idList === "") {
  //     dispatch(
  //       get(
  //         endpointAds + "/management/ads/report",
  //         (res) => {
  //           const data = res.data.data;
  //           handleReport(data);
  //         },
  //         (err) => {
  //           console.log("FAILED GET LIST REPORT :", err);
  //         }
  //       )
  //     );
  //     return;
  //   }
  //   if (selectedType === "advertiser") {
  //     dispatch(
  //       get(
  //         endpointAds + "/management/ads/report?advertiser_id=" + idList,
  //         (res) => {
  //           const data = res.data.data;
  //           handleReport(data);
  //         },
  //         (err) => {
  //           console.log("FAILED GET LIST REPORT :", err);
  //         }
  //       )
  //     );
  //     return;
  //   }

  //   dispatch(
  //     get(
  //       endpointAds + "/management/ads/report?ads_id=" + idList,
  //       (res) => {
  //         const data = res.data.data;
  //         handleReport(data);
  //       },
  //       (err) => {
  //         console.log("FAILED GET LIST REPORT :", err);
  //       }
  //     )
  //   );
  // }, [selectedId]);

  useEffect(() => {
    const audFilt = audiencesFilter[selectedFilter];
    const idList = selectedId.map((el) => el.id).join(",");

    setDataKeys([]);
    let urlEndpoint = endpointAds + "/management/ads/report";
    if (selectedType === "advertiser") {
      urlEndpoint += "?user_id=" + idList + "&";
    } else if (selectedType === "campaign") {
      urlEndpoint += "?ads_id=" + idList + "&";
    } else {
      urlEndpoint += "?";
    }

    console.log(urlEndpoint);

    if (audFilt === "") {
      dispatch(
        get(
          urlEndpoint,
          (res) => {
            const data = res.data.data;
            handleReport(data);
          },
          (err) => {
            console.log("FAILED GET LIST REPORT :", err);
          }
        )
      );
    } else {
      urlEndpoint += "timeline_filter=" + audFilt;
      dispatch(
        get(
          urlEndpoint,
          (res) => {
            const data = res.data.data;
            handleReport(data, false);
            const timelineDeepfilter = [];
            const dtKey = [];

            const startOfYear = new Date(new Date().getFullYear(), 0, 1);
            const endOfYear = new Date(new Date().getFullYear(), 12, 0);
            const monthsRange = getDatesRange(
              new Date(startOfYear),
              new Date(endOfYear),
              "months"
            );
            data.timeline.map((item) => {
              let fieldName = audFilt;
              if (audFilt === "platform") {
                fieldName = "os";
              } else if (audFilt === "age") {
                fieldName = "age_range";
              } else if (audFilt === "building") {
                fieldName = "city_name";
              }
              if (!dtKey.some((dt) => dt === item[fieldName])) {
                dtKey.push(item[fieldName]);
              }
            });
            const timelineFormatted = monthsRange.map((date) => {
              const month = moment(date).format("MMM") + " ";
              const monthNumber = moment(date).format("M");
              const year = moment(date).format("YYYY");
              const adsData = data.timeline.filter(
                (el) =>
                  parseInt(el.month) === parseInt(monthNumber) &&
                  parseInt(el.year) === parseInt(year)
              );

              const retData = {
                m: parseInt(monthNumber),
                y: parseInt(year),
                month: month + year,
                view: 0,
                click: 0,
              };
              dtKey.map((item) => {
                retData[item] = 0;
              });
              if (adsData.length === 0) {
                retData.empty = true;
                timelineDeepfilter.push(retData);
              } else {
                adsData.map((item) => {
                  const checkArr = timelineDeepfilter.findIndex(
                    (el) => el.y === item.year && el.m === item.month
                  );
                  let fieldName = audFilt;
                  if (audFilt === "platform") {
                    fieldName = "os";
                  } else if (audFilt === "age") {
                    fieldName = "age_range";
                  } else if (audFilt === "building") {
                    fieldName = "city_name";
                  }

                  retData.empty = false;
                  if (checkArr > -1) {
                    timelineDeepfilter[checkArr][item[fieldName]] =
                      item.total_repeated_view + item.total_repeated_click;
                  } else {
                    retData[item[fieldName]] =
                      item.total_repeated_view + item.total_repeated_click;
                    timelineDeepfilter.push(retData);
                  }
                });
              }
            });
            setTimeline([...timelineDeepfilter]);
            setDataKeys([...dtKey]);
          },
          (err) => {
            console.log("FAILED GET LIST REPORT :", err);
          }
        )
      );
    }
  }, [selectedFilter, selectedMonth, selectedId]);
  const now = moment().format(`DDMMyyyy${parseInt(Math.random() * 100000)}`);
  return (
    <Loading loading={loadingPopup}>
      <div className="row no-gutters">
        <div className="col-4">
          {group !== "vas_advertiser" && (
            <>
              <h5 className="pl-4 ads-card-title">Advertiser Account</h5>
              <div
                className="Container flex-column pb-5 pr-4"
                style={{ maxHeight: 628, height: 628 }}
              >
                <>
                  <InputSearch
                    value={searchAdvertiser}
                    onChange={(e) => setSearchAdvertiser(e.target.value)}
                  />
                  {loadingBanner && (
                    <div className="w-100 py-5 d-flex justify-content-center">
                      <ClinkLoader />
                    </div>
                  )}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      padding: "0.75rem 1.25rem",
                    }}
                  >
                    <div className="col-8" style={{ padding: 0 }}>
                      <strong>Advertiser Name</strong>
                    </div>
                    <div
                      className="col-4"
                      style={{ padding: 0, textAlign: "center" }}
                    >
                      <strong>Total Ads</strong>
                    </div>
                  </div>
                  <ListGroup className="ads-list-scroll">
                    {!loadingAdvertiser &&
                      advertisers.map((el, index) => (
                        <ListGroupItem
                          style={{ cursor: "pointer" }}
                          key={index}
                          tag="b"
                          active={selectedId.some(
                            (items) => items.id === el.id
                          )}
                          onClick={() => {
                            setAdvertiser("");
                            if (
                              !selectedId.some((items) => items.id === el.id)
                            ) {
                              if (selectedType != "advertiser") {
                                setSelectedType("advertiser");
                                setSelectedId([el]);
                              } else {
                                setSelectedId([...selectedId, el]);
                              }
                            } else {
                              setSelectedId(
                                selectedId.filter((items) => items.id !== el.id)
                              );
                            }
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <div
                              className="col-8"
                              style={{ padding: 0, fontWeight: 100 }}
                            >
                              {el.advertiser_name}
                            </div>
                            <div
                              className="col-4"
                              style={{
                                padding: 0,
                                textAlign: "center",
                                fontWeight: 100,
                              }}
                            >
                              {el.total_ads}
                            </div>
                          </div>
                        </ListGroupItem>
                      ))}
                  </ListGroup>
                  {!loadingAdvertiser && advertisers.length === 0 && (
                    <div className="w-100 text-center">No Advertiser found</div>
                  )}
                  {!loadingAdvertiser &&
                    advertisers.length !== 0 &&
                    advertisers.length >= limitAdvertiser && (
                      <div
                        className="btn w-100 text-primary"
                        onClick={() => setLimitAdvertiser(limitAdvertiser + 10)}
                      >
                        load 10 more
                      </div>
                    )}
                </>
                {/* <div className="row mb-4 p-3">
                </div> */}
              </div>
            </>
          )}
          <h5 className="pl-4 ads-card-title">Campaign</h5>
          <div
            className="Container flex-column pb-5 pr-4"
            style={{ maxHeight: 628, height: 628 }}
          >
            <div className="row mb-4 p-3">
              <Tab
                labels={tabs}
                setTab={setType}
                activeTab={0}
                contents={[
                  <>
                    <InputSearch
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                    />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        padding: "0.75rem 1.25rem",
                      }}
                    >
                      <div className="col-6" style={{ padding: 0 }}>
                        <strong>Campaign Name</strong>
                      </div>
                      <div
                        className="col-3"
                        style={{ padding: 0, textAlign: "center" }}
                      >
                        <strong>Views</strong>
                      </div>
                      <div
                        className="col-3"
                        style={{ padding: 0, textAlign: "center" }}
                      >
                        <strong>Clicks</strong>
                      </div>
                    </div>
                    <ListGroup className="ads-list-scroll">
                      {popups.map((el, index) => (
                        <ListGroupItem
                          style={{ cursor: "pointer" }}
                          key={index}
                          tag="b"
                          // active={index === active}
                          active={selectedId.some((item) => item.id === el.id)}
                          onClick={() => {
                            setPopup("");
                            if (
                              !selectedId.some((items) => items.id === el.id)
                            ) {
                              if (selectedType != "campaign") {
                                setSelectedType("campaign");
                                setSelectedId([el]);
                              } else {
                                setSelectedId([...selectedId, el]);
                              }
                            } else {
                              setSelectedId(
                                selectedId.filter((items) => items.id !== el.id)
                              );
                            }
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <div
                              className="col-6"
                              style={{ padding: 0, fontWeight: 100 }}
                            >
                              {el.content_name}
                            </div>
                            <div
                              className="col-3"
                              style={{
                                padding: 0,
                                fontWeight: 100,
                                textAlign: "center",
                              }}
                            >
                              {el.impression_repeated_view}
                            </div>
                            <div
                              className="col-3"
                              style={{
                                padding: 0,
                                fontWeight: 100,
                                textAlign: "center",
                              }}
                            >
                              {el.impression_repeated_click}
                            </div>
                          </div>
                        </ListGroupItem>
                      ))}
                    </ListGroup>
                    {!loadingPopup && popups.length === 0 && (
                      <div className="w-100 text-center">No Popup found</div>
                    )}
                    {!loadingPopup &&
                      popups.length !== 0 &&
                      popups.length >= limitPopup && (
                        <div
                          className="btn w-100 text-primary"
                          onClick={() => setLimitPopup(limitPopup + 10)}
                        >
                          load 10 more
                        </div>
                      )}
                  </>,
                  <>
                    <InputSearch
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                    />
                    {loadingBanner && (
                      <div className="w-100 py-5 d-flex justify-content-center">
                        <ClinkLoader />
                      </div>
                    )}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        padding: "0.75rem 1.25rem",
                      }}
                    >
                      <div className="col-6" style={{ padding: 0 }}>
                        <strong>Campaign Name</strong>
                      </div>
                      <div
                        className="col-3"
                        style={{ padding: 0, textAlign: "center" }}
                      >
                        <strong>Views</strong>
                      </div>
                      <div
                        className="col-3"
                        style={{ padding: 0, textAlign: "center" }}
                      >
                        <strong>Clicks</strong>
                      </div>
                    </div>
                    <ListGroup className="ads-list-scroll">
                      {!loadingBanner &&
                        banners.map((el, index) => (
                          <ListGroupItem
                            style={{ cursor: "pointer" }}
                            key={index}
                            tag="b"
                            active={selectedId.some(
                              (items) => items.id === el.id
                            )}
                            onClick={() => {
                              setBanner("");
                              if (
                                !selectedId.some((items) => items.id === el.id)
                              ) {
                                if (selectedType != "campaign") {
                                  setSelectedType("campaign");
                                  setSelectedId([el]);
                                } else {
                                  setSelectedId([...selectedId, el]);
                                }
                              } else {
                                setSelectedId(
                                  selectedId.filter(
                                    (items) => items.id !== el.id
                                  )
                                );
                              }
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div
                                className="col-6"
                                style={{ padding: 0, fontWeight: 100 }}
                              >
                                {el.content_name}
                              </div>
                              <div
                                className="col-3"
                                style={{
                                  padding: 0,
                                  fontWeight: 100,
                                  textAlign: "center",
                                }}
                              >
                                {el.impression_repeated_view}
                              </div>
                              <div
                                className="col-3"
                                style={{
                                  padding: 0,
                                  fontWeight: 100,
                                  textAlign: "center",
                                }}
                              >
                                {el.impression_repeated_click}
                              </div>
                            </div>
                          </ListGroupItem>
                        ))}
                    </ListGroup>
                    {!loadingBanner && banners.length === 0 && (
                      <div className="w-100 text-center">No Banner found</div>
                    )}
                    {!loadingPopup &&
                      banners.length !== 0 &&
                      banners.length >= limitBanner && (
                        <div
                          className="btn w-100 text-primary"
                          onClick={() => setLimitBanner(limitBanner + 10)}
                        >
                          load 10 more
                        </div>
                      )}
                  </>,
                ]}
              />
            </div>
          </div>
        </div>
        <div className="col-8">
          <h5 className="pl-4 ads-card-title">Summary</h5>
          <div
            className="Container flex-column pb-5 pr-4"
            style={{ overflow: "visible" }}
          >
            <div className="row">
              <div className="col-12">
                <div className="row pl-3 mb-0">
                  <h4
                    className="p-3"
                    style={{ display: "flex", flexDirection: "row" }}
                  >
                    <strong>
                      {selectedId.length === 0
                        ? "All Campaign"
                        : selectedId.length === 1 && selectedType === "campaign"
                        ? selectedId[0].content_name
                        : selectedType === "advertiser"
                        ? ""
                        : `Selected ${selectedId.length} Advertisements`}
                    </strong>
                    {selectedType === "campaign" && selectedId.length > 1 && (
                      <ListAds data={selectedId} />
                    )}
                  </h4>
                </div>
                <div className="row pl-3 mb-0">
                  {summary.length > 0 &&
                    summary.map((el, index) => {
                      return (
                        <div key={`summary-${index}`} className="col-3">
                          <SummaryItem
                            label={el.label}
                            icon={el.icon}
                            // icon="https://api.yipy.id/yipy-assets/asset-storage/img/9EC3211E8CCDA375F28D2166BCD066C1.png"
                            data={el.data}
                            download={() => {
                              const idList = selectedId
                                .map((el) => el.id)
                                .join(",");
                              return dispatch(
                                downloadAdsReport(idList, selectedType)
                              );
                            }}
                          />
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
          <h5 className="pl-4 ads-card-title">Timeline</h5>
          <div className="Container flex-column pb-5 pr-4">
            <div className="row mb-4">
              <div className="col-12">
                <div className="col-12">
                  <div className="row mb-4">
                    <div className="col-2">
                      <ButtonDropdown
                        className="ads-active-button"
                        color="primary"
                        isOpen={dropdownOpen}
                        toggle={toggle}
                        style={{ display: "none" }}
                      >
                        <Button className="ads-dropdown-button">
                          {selectedMonth}
                        </Button>
                        <DropdownToggle
                          split
                          className="ads-dropdown-button"
                          caret
                        ></DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem
                            // header
                            onClick={() => {
                              setSelectedMonth("Time");
                            }}
                          >
                            All
                          </DropdownItem>
                          {timeline.length > 0 &&
                            timeline.map((el) => {
                              return (
                                <>
                                  <DropdownItem
                                    disabled={el.empty}
                                    onClick={() => {
                                      setSelectedMonth(el.month);
                                    }}
                                  >
                                    {el.month}
                                  </DropdownItem>
                                </>
                              );
                            })}
                        </DropdownMenu>
                      </ButtonDropdown>
                    </div>
                    {audiencesFilter.map((el, index) => {
                      if (el === "") return undefined;
                      return (
                        <div key={`filter-${index}`} className="col-2">
                          <Button
                            onClick={() =>
                              selectedFilter === index
                                ? setSelectedFilter(0)
                                : setSelectedFilter(index)
                            }
                            className={
                              selectedFilter === index
                                ? "ads-active-button"
                                : "ads-inactive-button"
                            }
                          >
                            {toSentenceCase(el)}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <LineCharts data={timeline} dataKeys={dataKeys} />
              </div>
            </div>
            <div className="row"></div>
          </div>
          <h5 className="pl-4 ads-card-title">Details</h5>
          <div className="Container flex-column pb-5 pr-4">
            <div className="row">
              <div className="col-6 ads-detail-container">
                <Piecharts data={impressionDetail} color={colorList} />
                <div className="ads-detail-title">Impressions</div>
                {impressionDetail.map((el, index) => {
                  return (
                    <div key={`impression-${index}`}>
                      <span>{toSentenceCase(el.name.replace(/_/g, " "))}</span>{" "}
                      :<span className="pl-1">{toThousand(el.value)}</span>
                    </div>
                  );
                })}
              </div>
              <div className="col-6 ads-detail-container">
                <Piecharts data={platformDetail} color={colorList} />
                <div className="ads-detail-title">Platform</div>
                {platformDetail.map((el) => {
                  return (
                    <div>
                      <span>{toSentenceCase(el.name.replace(/_/g, " "))}</span>{" "}
                      :<span className="pl-1">{toThousand(el.value)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="row">
              <div className="col-6 ads-detail-container">
                <Piecharts data={ageDetail} color={colorList} />
                <div className="ads-detail-title">Age</div>
                {ageDetail.map((el) => {
                  return (
                    <div>
                      <span>{toSentenceCase(el.name.replace(/_/g, " "))}</span>{" "}
                      :<span className="pl-1">{toThousand(el.value)}</span>
                    </div>
                  );
                })}
              </div>
              <div className="col-6 ads-detail-container">
                <Piecharts data={genderDetail} color={colorList} />
                <div className="ads-detail-title">Gender</div>
                {genderDetail.map((el) => {
                  return (
                    <div>
                      <span>{toSentenceCase(el.name.replace(/_/g, " "))}</span>{" "}
                      :<span className="pl-1">{toThousand(el.value)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="row">
              <div className="col-6 ads-detail-container">
                <Piecharts data={buildingDetail} color={colorList} />
                <div className="ads-detail-title">Building</div>
                {buildingDetail.map((el) => {
                  return (
                    <div>
                      <span>
                        {toSentenceCase(
                          el.name.toLowerCase().replace(/_/g, " ")
                        )}
                      </span>{" "}
                      :<span className="pl-1">{toThousand(el.value)}</span>
                    </div>
                  );
                })}
              </div>
              <div className="col-6 ads-detail-container">
                <Piecharts data={occupationDetail} color={colorList} />
                <div className="ads-detail-title">Occupation</div>
                {occupationDetail.map((el) => {
                  return (
                    <div>
                      <span>{toSentenceCase(el.name.replace(/_/g, " "))}</span>{" "}
                      :<span className="pl-1">{toThousand(el.value)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Loading>
  );
}

export default Component;

const InputSearch = (props) => (
  <div className="search-input mb-3">
    <label htmlFor="search">
      <FiSearch />
    </label>
    <input
      className="py-2"
      {...props}
      id="search"
      type="text"
      placeholder="Search"
    />
  </div>
);

const ListAds = ({ data }) => {
  const history = useHistory();
  const { role } = useSelector((state) => state.auth);
  const [modalHover, setModalHover] = useState(false);
  return (
    <div className="modal-hover">
      <button
        onClick={() => undefined}
        className="ml-2"
        onMouseEnter={() => setModalHover(true)}
        onMouseLeave={() => setModalHover(false)}
      >
        i
      </button>
      <div
        style={{ minWidth: 400 }}
        className={"list-modal-hover" + (modalHover ? " on" : "")}
        onMouseEnter={() => setModalHover(true)}
        onMouseLeave={() => setModalHover(false)}
      >
        {data.map((item, i) => (
          <div className="p-2" style={{ fontSize: 14 }}>
            {i + 1 + ". " + item.content_name}
          </div>
        ))}
      </div>
    </div>
  );
};
