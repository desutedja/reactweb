import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";

import SectionSeparator from "../../components/SectionSeparator";
import { editAds, createAds } from "../slices/ads";
import { get } from "../slice";
import { endpointAdmin, endpointAds } from "../../settings";

import Template from "./components/TemplateWithFormikBook";
import { Form, FieldArray, Field } from "formik";
import { adsSchema } from "./services/schemas";
import Input from "./inputBooking";
import InputDash from "../../components/InputDash";
import { days } from "../../utils";
import SubmitButton from "./components/SubmitButton";
import { toSentenceCase } from "../../utils";

const adsPayload = {
  appear_as: "banner",
  media: "apps",
  media_url: "",
  start_date: moment().format("YYYY-MM-DD"),
  end_date: moment().format("YYYY-MM-DD"),

  click_quota: null,
  view_quota: null,

  gender: "A",
  occupation: "all",
  age_from: 10,
  age_to: 85,
  os: "all",

  target_building: "allbuilding",
  building_list: [],

  content_name: "",
  content_type: "image",
  content_image: "",
  content_video: "",
  content_description: "",

  default_priority_score: 0,
  total_priority_score: 0,

  schedules: [
    {
      day: 1,
      hour_from: "00:00:00",
      hour_to: "00:00:00",
    },
    {
      day: 2,
      hour_from: "00:00:00",
      hour_to: "00:00:00",
    },
    {
      day: 3,
      hour_from: "00:00:00",
      hour_to: "00:00:00",
    },
    {
      day: 4,
      hour_from: "00:00:00",
      hour_to: "00:00:00",
    },
    {
      day: 5,
      hour_from: "00:00:00",
      hour_to: "00:00:00",
    },
    {
      day: 6,
      hour_from: "00:00:00",
      hour_to: "00:00:00",
    },
    {
      day: 7,
      hour_from: "00:00:00",
      hour_to: "00:00:00",
    },
  ],
};

const target_buildings = [
  { label: "All Building", value: "allbuilding" },
  { label: "Specific Building(s)", value: "specificbuilding" },
];

function Component() {
  const { auth } = useSelector((state) => state);

  const [score, setScore] = useState(0);
  const [scoreDef, setScoreDef] = useState(0);

  const [gender, setGender] = useState("A");
  const [agef, setAgef] = useState("10");
  const [aget, setAget] = useState("85");
  const [job, setJob] = useState("all");
  const [os, setOS] = useState("all");

  const [advertiser, setAdvertiser] = useState([]);
  const [searchAdvertiser, setSearchAdvertiser] = useState("");
  const [selectedAdvertiser, setSelectedAdvertiser] = useState([]);

  const { selected, loading } = useSelector((state) => state.ads);
  const { role } = useSelector((state) => state.auth);

  const [buildings, setBuildings] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [selectedBuildings, setSelectedBuildings] = useState(
    selected.building ? selected.building : []
  );
  const [searchbuilding, setSearchbuilding] = useState("");

  let dispatch = useDispatch();
  let history = useHistory();

  useEffect(() => {
    let i = 0;

    gender !== "A" && i++;
    job !== "all" && i++;
    (agef !== "10" || aget !== "85") && i++;
    os !== "all" && i++;

    setScore(i);
    setScoreDef(i);
  }, [agef, aget, gender, job, os]);

  useEffect(() => {
    searchbuilding.length > 1 &&
      dispatch(
        get(
          endpointAdmin +
            "/building" +
            "?limit=5&page=1" +
            "&search=" +
            searchbuilding,
          (res) => {
            let data = res.data.data.items;

            let formatted = data.map((el) => ({
              label: el.name,
              value: el.id,
            }));

            setBuildings(formatted);
          }
        )
      );
  }, [dispatch, searchbuilding]);

  //advertiser search
  useEffect(() => {
    dispatch(
      get(
        endpointAds +
          "/management/ads/advertiser?" +
          "&limit=5&page=1" +
          "&search=" +
          searchAdvertiser,
        (res) => {
          let data = res.data.data.items;

          let formatted = data.map((el) => {
            return {
              label: `${toSentenceCase(el.firstname)} ${toSentenceCase(
                el.lastname
              )} - ${el.email}`,
              value: el.id,
              email: el.email,
              firstname: el.firstname,
              lastname: el.lastname,
            };
          });

          setAdvertiser(formatted);
        }
      )
    );
  }, [dispatch, searchAdvertiser]);

  return (
    <Template
      slice="ads"
      payload={
        selected.content_name
          ? {
              ...adsPayload,
              ...selected,
              gender: selected.gender ? selected.gender : "A",
              content_name: selected.duplicate
                ? "Duplicate of " + selected.content_name
                : selected.content_name,
              duplicate: selected.duplicate,
              occupation: selected.occupation ? selected.occupation : "all",
              os: selected.os ? selected.os : "all",
              start_date: selected.start_date.split("T")[0],
              end_date: selected.end_date.split("T")[0],
              target_building:
                selected.buildings && selected.buildings.length > 0
                  ? "specificbuilding"
                  : "allbuilding",
              building_list:
                selected.buildings && selected.buildings.length > 0
                  ? selected.buildings.map((el) => ({
                      label: el.name,
                      value: el.id,
                    }))
                  : [],
              advertiser:
                selected.advertiser && selected.advertiser.length > 0
                  ? selected.advertiser.map((el) => ({
                      label: `${toSentenceCase(el.firstname)} ${toSentenceCase(
                        el.lastname
                      )} - ${el.email}`,
                      value: el.id,
                      email: el.email,
                      firstname: el.firstname,
                      lastname: el.lastname,
                    }))
                  : [],
            }
          : adsPayload
      }
      schema={adsSchema}
      formatValues={(values) => {
        const { schedules, building_list, ...ads } = values;

        return {
          ads: {
            ...ads,
            gender: ads.gender === "A" ? null : ads.gender,
            occupation: ads.occupation === "all" ? null : ads.occupation,
            os: ads.os === "all" ? null : ads.os,
            start_date: ads.start_date + " 00:00:00",
            end_date: ads.end_date + " 23:59:59",
            default_priority_score: scoreDef,
          },
          building_list: building_list.map((el) => el.value),
          advertiser: advertiser.map((el) => el.value),
          schedules: schedules,
        };
      }}
      edit={(data) => {
        // eslint-disable-next-line no-unused-vars
        const { schedules, ads, building_list } = data;
        dispatch(editAds({ ads, building_list }, history, selected.id, role));
      }}
      add={(data) => {
        if (auth.role === "bm") {
          const dataBM = {
            ...data,
            ads: {
              ...data.ads,
              appear_as: "banner",
            },
          };
          dispatch(createAds(dataBM, history));
          return;
        }
        dispatch(createAds(data, history));
      }}
      renderChild={(props) => {
        const { values, errors, setFieldValue } = props;

        console.log(errors);
        return (
          <Form className="Form">
            <Input
              {...props}
              label="Photo Facility"
              name="content_image"
              type="file"
              accept="image/*"
            />
            <Input {...props} label="Facility Name" name="facility_name" />
            {/* <InputDash
              type="fileImages"
              label="Attachment"
              placeholder="Insert File"
            /> */}
            <Input
              {...props}
              label="Description"
              name="content_description"
              type="textarea"
            />
            <Input
              {...props}
              label="More Info"
              name="content_description"
              type="textarea"
            />
            <Input 
              {...props}
              label="Quota"
              name="quota"
            />
            <Input 
              {...props}
              label="Duration"
              name="duration"
              type="radio"
              options={[
                {value: "1", label: "1 Hour"},
                {value: "2", label: "2 Hours"},
              ]}
            />
            <div className="row"
              style={{
                width: "100%",
                maxWidth: "calc(100% / 1.7 - 16px)",
                minWidth: "calc(100% / 1.7 - 16px)",
                height: "32px",
                marginTop: "24px",
                textAlign: "left",
              }}
            >
              <h5>Other Facilities</h5>
            </div>
            <div className="row">
              <div className="col"
              style={{minWidth: 240}}
              >
                <Input 
                  {...props}
                  name="toilet"
                  type="radiobook"
                  options={[
                    {value: "toilet", label: "Toilet"},
                  ]}
                />
                
              </div>
              <div className="col"
              style={{minWidth: 240}}>
                <Input 
                  {...props}
                  name="wifi"
                  type="radiobook"
                  options={[
                    {value: "wifi", label: "Wifi"},
                  ]}
                />
                
              </div>
              <div className="col"
              style={{minWidth: 240}}>
                <Input 
                  {...props}
                  name="towel"
                  type="radiobook"
                  options={[
                    {value: "towel", label: "Towel"},
                  ]}
                />
                
              </div>
            </div>
            
            {!selected.id && (
              <>
                <SectionSeparator title="Operational Hour" />
                <FieldArray
                  name="schedules"
                  render={(arrayHelpers) => (
                    <div
                      className="Input"
                      style={{
                        maxWidth: 600,
                      }}
                    >
                      {values.schedules.map((friend, index) => (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: 8,
                          }}
                        >
                          <p
                            style={{
                              marginRight: 16,
                              flex: 1,
                            }}
                          >
                            {days[values.schedules[index].day - 1]}:{" "}
                          </p>
                          <Field
                            name={`schedules.${index}.hour_from`}
                            type="time"
                            step="1"
                          />
                          <p
                            style={{
                              marginLeft: 16,
                              marginRight: 16,
                              textAlign: "center",
                            }}
                          >
                            -
                          </p>
                          <Field
                            name={`schedules.${index}.hour_to`}
                            type="time"
                            step="1"
                          />
                          <button
                            type="button"
                            style={{
                              marginLeft: 16,
                              color: 'white'
                            }}
                            onClick={() => {
                              setFieldValue(
                                `schedules.${index}.hour_from`,
                                "00:00:00"
                              );
                              setFieldValue(
                                `schedules.${index}.hour_to`,
                                "23:59:59"
                              );
                            }}
                          >
                            Set All Day
                          </button>
                          <button
                            type="button"
                            style={{
                              marginLeft: 16,
                              color: 'white'
                            }}
                            onClick={() => {
                              setFieldValue(
                                `schedules.${index}.hour_from`,
                                "00:00:00"
                              );
                              setFieldValue(
                                `schedules.${index}.hour_to`,
                                "00:00:00"
                              );
                            }}
                          >
                            Set None
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                />
              </>
            )}
            <SubmitButton loading={loading} errors={errors} />
          </Form>
        );
      }}
    />
  );
}

export default Component;
