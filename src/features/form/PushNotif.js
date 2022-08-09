import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";

import SectionSeparator2 from "../../components/SectionSeparator2";
import { editAds, createAds } from "../slices/ads";
import { get } from "../slice";
import { endpointAdmin, endpointAds } from "../../settings";

import Template from "./components/TemplateWithFormikPushNotif";
import { Form, FieldArray, Field } from "formik";
import { adsSchema } from "./services/schemas";
import Input from "./inputBooking";
import InputDash from "../../components/InputDash";
import { days } from "../../utils";
import SubmitButton from "./components/SubmitButton";
import { toSentenceCase } from "../../utils";
import Column from "../../components/Column";
import Row from "../../components/Row";
import { Card, CardBody } from "reactstrap";

const pushNotifPayload = {
  title: "",
  caption: "",
  image: "",
  link: "",

  filter: "age",
  filter_age_from: "",
  filter_age_to: "",
  filter_building: "",
  filter_gender: "",
  filter_billing: "",

  send_on: moment().format("YYYY-MM-DD"),
  at_time: "00:00",

  preview: "android"

};


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
    dispatch(
      get(
        endpointAdmin +
          "/management/building" +
          "?limit=10&page=1" +
          "&search=",
        (res) => {
          let data = res.data.data.items;

          let formatted = data.map((el) => ({
            label: el.building_name + " by " + el.management_name,
            value: el.id,
          }));

          setBuildings(formatted);
        }
      )
    );
  }, [dispatch]);

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
              ...pushNotifPayload,
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
          : pushNotifPayload
      }
      // schema={adsSchema}
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
          <>
          <Column style={{ width: "100%" }}>
            <Row>
              <Column style={{ flex: "7", display: "block" }}>
                <Card style={{ margin: "0 20px 20px 16px", borderRadius: 6, border: 0, boxShadow: "none", background: "transparent" }}>
                  <CardBody>
                    <div className="Container" style={{ margin: "0 0 16px 0" }}>
                      <div className="Form-Align-Left">
                        <SectionSeparator2 title="Information" />
                        <Input {...props} 
                          label="Title"
                          name="title"
                          suffix=" 50"
                          hint="Only displayed on iOS 8.4 and above and Android."
                        />
                        <Input
                          {...props}
                          label="Caption"
                          name="caption"
                          suffix="100"
                          hint="Approx. displayed characters: 80-100 characters."
                        />
                      </div>
                    </div>
                    <div className="Container"style={{ margin: "0 0 16px 0" }}>
                      <div className="Form-Align-Left">
                        <SectionSeparator2 title="Attachment" />
                        <Input {...props} 
                          label="Add Image"
                          name="image"
                          hint="Supported file formats: JPEG, JPG & PNG. File size max. 1MB with aspect ratio 2:1."
                          type="file"
                          optional
                        />
                        <Input
                          {...props}
                          label="Deep Link or Web Link"
                          name="link"
                          optional
                        />
                      </div>
                    </div>
                    <div className="Container" style={{ margin: "0 0 16px 0" }}>
                      <div className="Form-Align-Left">
                        <SectionSeparator2 title="Filters (optional)" />
                        <div
                          className="Input"
                          style={{
                            maxWidth: 600,
                          }}
                        >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                marginBottom: 8,
                              }}
                              className="row"
                            >
                              <div
                                style={{
                                  flex: 1,
                                  maxWidth: 200,
                                }}
                                className="col"
                              >
                                <Input 
                                  {...props}
                                  type="select"
                                  name="filter"
                                  options={[
                                    {label: "Age", value: "age"},
                                    {label: "Building", value: "building"},
                                    {label: "Gender", value: "gender"},
                                    {label: "Billing", value: "billing"}
                                  ]}
                                />
                              </div>
                              {values.filter === "age" ?
                                <>
                                  <div className="col"
                                    style={{maxWidth: 200}}>
                                  <Input
                                    {...props}
                                    name="filter_age_from"
                                    suffix="years"
                                    style={{maxWidth: 100}}
                                  />
                                  </div>
                                  <div className="col"
                                      style={{maxWidth: 200}}>
                                    <Input
                                      {...props}
                                      name="filter_age_to"
                                      suffix="years"
                                      style={{maxWidth: 100}}
                                    />
                                  </div>
                                </>
                              :
                              values.filter == "building" ?
                                <>
                                  <div className="col">
                                    <Input
                                      {...props}
                                      name="filter_building"
                                      type="select"
                                      options={buildings}
                                    />
                                  </div>
                                </>
                              :
                              values.filter == "gender" ?
                                <>
                                  <div className="col">
                                  <Input
                                    {...props}
                                    name="filter_gender"
                                    type="radio"
                                    placeholder="Select Gender"
                                    options={[
                                      {label: "Male", value: "m"},
                                      {label: "Female", value: "f"},
                                    ]}
                                  />
                                  </div>
                                </>
                              :
                              values.filter == "billing" ?
                                <>
                                  <div className="col">
                                  <Input
                                    {...props}
                                    name="filter_billing"
                                    type="select"
                                    placeholder="Select Billing Status"
                                    options={[
                                      {label: "Paid", value: "paid"},
                                      {label: "Unpaid", value: "unpaid"},
                                    ]}
                                  />
                                  </div>
                                </>
                              :[]    
                              }
                            </div>
                        </div>
                      </div>
                    </div>
                      
                    <div className="Container" style={{ margin: "0 0 16px 0" }}>
                      <div className="Form-Align-Left">
                        {!selected.id && (
                          <>
                            <SectionSeparator2 title="Schedule" />
                            <Input 
                              {...props}
                              type="radio"
                              name="scheduling_type"
                              label="Scheduling Options"
                              options={[
                                {label: "Send at designated time", value: "designated"},
                                {label: "Send as soon as campaign is launched", value: "launched"},
                                {label: "Due Date Billing", value: "due_date"}
                              ]}
                            />
                            <Input 
                              {...props}
                              type="radio"
                              name="scheduling_delivery"
                              label="Set Delivery Schedule"
                              hint="In case the user aggregation procedure takes time, actual notification delivery may be later than the time set here."
                              options={[
                                {label: "Once", value: "once"},
                                {label: "Daily", value: "daily"},
                                {label: "Weekly", value: "weekly"}
                              ]}
                            />
                            <Input 
                              {...props}
                              type="date"
                              name="send_on"
                              label="Send On"
                            />
                            <Input 
                              {...props}
                              type="time"
                              name="at_time"
                              label="at time"
                            />
                          </>
                        )}
                        <div className="Form">
                          <SubmitButton loading={loading} errors={errors} />
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Column>
              <Column style={{ flex: "3", display: "block" }}>
                <Card style={{ marginBottom: "20px", borderRadius: 6, border: 0, boxShadow: "none", background: "transparent" }}>
                  <CardBody>
                    <div className="Container" style={{ margin: "0 0 16px 0" }}>
                      <div>
                        <p className="Separator2Label">Preview</p>
                        <p style={{ color: "#5A5A5A", fontSize: 12 }}>Actual appearance of push notification may differ.</p>
                        <hr />
                        <p className="Separator2Label" style={{ fontSize: "14px" }}>Preview Type</p>
                        <div>
                          <Input 
                            {...props}
                            type="radio"
                            name="preview"
                            options={[
                              {label: "iOS", value: "ios"},
                              {label: "Android", value: "android"},
                            ]}
                          />
                        </div>
                        {
                          values.preview == "android" ?
                          <div className="text-center">
                            <img
                                src={require('./../../assets/adnroid_prev.jpg')}
                                style={{
                                    maxHeight: 300,
                                    width: 'auto',
                                    marginTop: 16,
                                    marginBottom: 16,
                                    borderRadius: 6,
                                }}
                            />
                          </div>
                          :
                          <div className="text-center">
                            <img
                                src={require('./../../assets/ios_prev.jpg')}
                                style={{
                                    maxHeight: 300,
                                    width: 'auto',
                                    marginTop: 16,
                                    marginBottom: 16,
                                    borderRadius: 6,
                                }}
                            />
                          </div>
                        }
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Column>
            </Row>
          </Column>
          
          </>
        );
      }}
    />
  );
}

export default Component;
