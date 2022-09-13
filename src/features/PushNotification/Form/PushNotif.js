import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { endpointAdmin } from "../../../settings";
import { get } from "../../slice";

import Template from "../../form/components/TemplateWithFormikPushNotif";
import { Form } from "formik";
import Input from "../../form/inputBooking";
import SubmitButton from "../../form/components/SubmitButton";

import SectionSeparator2 from "../../../components/SectionSeparator2";
import Column from "../../../components/Column";
import Row from "../../../components/Row";
import { Card, CardBody } from "reactstrap";

import moment from "moment";
import { createPushNotif, editPushNotif } from "../../slices/pushnotification";

const pushNotifPayload = {
  title: "",
  body: "",
  content: "",
  image: "",
  link_url: "",
  is_schedule: "",
  remarks: "",

  filter: "",
  filter1: "",
  filter2: "",
  filter3: "",
  filter4: "",
  building_id: "",
  gender: "",
  billing: "",
  age_from: "",
  age_to: "",
  day: 1,
  due_date: "",

  send_on: moment().format("YYYY-MM-DD"),
  schedule_start: moment().format("YYYY-MM-DD"),
  schedule_end: moment().format("YYYY-MM-DD"),
  schedule_time: "00:00",

  preview: "android",
};

const weekDays = [
  { value: 1, label: "Sunday" },
  { value: 2, label: "Monday" },
  { value: 3, label: "Tuesday" },
  { value: 4, label: "Wednesday" },
  { value: 5, label: "Thursday" },
  { value: 6, label: "Friday" },
  { value: 7, label: "Saturday" },
];

const dueDate = [
  { value: 3, label: "H-3 Due Date" },
  { value: 1, label: "H-1 Due Date" },
  { value: 0, label: "H-H Due Date" },
];
function Component() {
  const { loading, selected } = useSelector((state) => state.pushnotification);

  const [buildings, setBuildings] = useState([]);

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

  return (
    <Template
      pagetitle="Create Push Notification"
      slice="pushnotification"
      payload={
        selected.id
          ? {
              ...pushNotifPayload,
              ...selected,
            }
          : pushNotifPayload
      }
      // schema={}
      formatValues={(values) => ({
        ...values,
        filter:
          ((values.age_from && values.age_to) === null ||
            (values.age_from && values.age_to) === "") &&
          values.gender === "" &&
          (values.building_id === null || values.building_id === "") &&
          values.billing === ""
            ? null
            : ((values.age_from && values.age_to) !== null ||
                (values.age_from && values.age_to) !== "") &&
              (values.building_id === null || values.building_id === "") &&
              values.gender === "" &&
              values.billing === ""
            ? "age"
            : ((values.age_from && values.age_to) === null ||
                (values.age_from && values.age_to) === "") &&
              (values.building_id !== null || values.building_id === "") &&
              values.gender === "" &&
              values.billing === ""
            ? "building"
            : ((values.age_from && values.age_to) === null ||
                (values.age_from && values.age_to) === "") &&
              (values.building_id === null || values.building_id === "") &&
              values.gender !== "" &&
              values.billing === ""
            ? "gender"
            : ((values.age_from && values.age_to) === null ||
                (values.age_from && values.age_to) === "") &&
              (values.building_id === null || values.building_id === "") &&
              values.gender === "" &&
              values.billing !== ""
            ? "billing"
            : ((values.age_from && values.age_to) !== null ||
                (values.age_from && values.age_to) !== "") &&
              (values.building_id !== null || values.building_id === "") &&
              values.gender === "" &&
              values.billing === ""
            ? "age, building"
            : ((values.age_from && values.age_to) !== null ||
                (values.age_from && values.age_to) !== "") &&
              (values.building_id === null || values.building_id === "") &&
              values.gender !== "" &&
              values.billing === ""
            ? "age, gender"
            : ((values.age_from && values.age_to) !== null ||
                (values.age_from && values.age_to) !== "") &&
              (values.building_id === null || values.building_id === "") &&
              values.gender === "" &&
              values.billing !== ""
            ? "age, billing"
            : ((values.age_from && values.age_to) === null ||
                (values.age_from && values.age_to) === "") &&
              (values.building_id !== null || values.building_id === "") &&
              values.gender !== "" &&
              values.billing === ""
            ? "building, gender"
            : ((values.age_from && values.age_to) === null ||
                (values.age_from && values.age_to) === "") &&
              (values.building_id !== null || values.building_id === "") &&
              values.gender === "" &&
              values.billing !== ""
            ? "building, billing"
            : ((values.age_from && values.age_to) === null ||
                (values.age_from && values.age_to) === "") &&
              (values.building_id === null || values.building_id === "") &&
              values.gender !== "" &&
              values.billing !== ""
            ? "gender, billing"
            : ((values.age_from && values.age_to) !== null ||
                (values.age_from && values.age_to) !== "") &&
              (values.building_id !== null || values.building_id === "") &&
              values.gender !== "" &&
              values.billing === ""
            ? "age, building, gender"
            : ((values.age_from && values.age_to) !== null ||
                (values.age_from && values.age_to) !== "") &&
              (values.building_id !== null || values.building_id === "") &&
              values.gender === "" &&
              values.billing !== ""
            ? "age, building, billing"
            : ((values.age_from && values.age_to) !== null ||
                (values.age_from && values.age_to) !== "") &&
              (values.building_id === null || values.building_id === "") &&
              values.gender !== "" &&
              values.billing !== ""
            ? "age, gender, billing"
            : ((values.age_from && values.age_to) === null ||
                (values.age_from && values.age_to) === "") &&
              (values.building_id !== null || values.building_id === "") &&
              values.gender !== "" &&
              values.billing !== ""
            ? "building, gender, billing"
            : ((values.age_from && values.age_to) !== null ||
                (values.age_from && values.age_to) !== "") &&
              (values.building_id !== null || values.building_id === "") &&
              values.gender !== "" &&
              values.billing !== ""
            ? "age, building, gender, billing"
            : values.filter1 ||
              values.filter2 ||
              values.filter3 ||
              values.filter4 === values.filter1 ||
              values.filter2 ||
              values.filter3 ||
              values.filter4
            ? null
            : "",
        is_schedule:
          values.scheduling_type === "is_schedule" ||
          values.scheduling_type === "due_date"
            ? true
            : false,
        remarks:
          values.scheduling_type === "due_date_type" && values.due_date === 0
            ? "h-h"
            : values.scheduling_type === "due_date_type" &&
              values.due_date === 1
            ? "h-1"
            : values.scheduling_type === "due_date_type" &&
              values.due_date === 3
            ? "h-3"
            : values.scheduling_delivery
            ? values.scheduling_delivery
            : "",
        due_date: values.due_date !== "" ? values.due_date : null,
        day: values.scheduling_delivery === "weekly" ? values.day : null,
        schedule_start:
          values.scheduling_delivery === "once"
            ? values.send_on + " 00:00:00"
            : values.schedule_start + " 00:00:00",
        schedule_end:
          values.scheduling_delivery === "once"
            ? values.send_on + " 00:00:00"
            : values.schedule_end + " 23:59:59",
        is_active: true,
        age_from:
          values.filter1 === "age" ||
          values.filter2 === "age" ||
          values.filter3 === "age" ||
          values.filter4 === "age"
            ? parseInt(values.age_from)
            : null,
        age_to:
          values.filter1 === "age" ||
          values.filter2 === "age" ||
          values.filter3 === "age" ||
          values.filter4 === "age"
            ? parseInt(values.age_to)
            : null,
        building_id:
          values.filter1 === "building" ||
          values.filter2 === "building" ||
          values.filter3 === "building" ||
          values.filter4 === "building"
            ? parseInt(values.building_id)
            : null,
        billing:
          values.filter1 === "billing" ||
          values.filter2 === "billing" ||
          values.filter3 === "billing" ||
          values.filter4 === "billing"
            ? values.billing
            : "",
        gender:
          values.filter1 === "gender" ||
          values.filter2 === "gender" ||
          values.filter3 === "gender" ||
          values.filter4 === "gender"
            ? values.gender
            : "",
      })}
      add={(data) => {
        delete data[undefined];
        delete data["preview"];
        delete data["filter1"];
        delete data["filter1_label"];
        delete data["filter2"];
        delete data["filter2_label"];
        delete data["filter3"];
        delete data["filter3_label"];
        delete data["filter4"];
        delete data["filter4_label"];
        delete data["scheduling_delivery"];
        delete data["scheduling_type"];
        delete data["day_label"];
        delete data["building_id_label"];
        delete data["send_on"];

        dispatch(createPushNotif(data, history));
      }}
      renderChild={(props) => {
        const { setFieldValue, values, errors } = props;
        return (
          <Column style={{ width: "100%" }}>
            <Form>
              <Row>
                <Column style={{ flex: "7", display: "block" }}>
                  <Card
                    style={{
                      margin: "0 20px 20px 16px",
                      borderRadius: 6,
                      border: 0,
                      boxShadow: "none",
                      background: "transparent",
                    }}
                  >
                    <CardBody>
                      <div
                        className="Container"
                        style={{ margin: "0 0 16px 0" }}
                      >
                        <div className="Form-Align-Left">
                          <SectionSeparator2 title="Information" />
                          {!selected.id ? (
                            <Input
                              {...props}
                              required
                              label="Title"
                              name="title"
                              suffix=" 50"
                              hint="Only displayed on iOS 8.4 and above and Android."
                            />
                          ) : (
                            <Input
                              {...props}
                              required
                              label="Title"
                              name="title"
                              suffix=" 50"
                              hint="Only displayed on iOS 8.4 and above and Android."
                              disabled
                            />
                          )}
                          <Input
                            {...props}
                            required
                            label="Caption"
                            name="body"
                            suffix="100"
                            hint="Approx. displayed characters: 80-100 characters."
                          />
                          <Input
                            {...props}
                            required
                            type="editor"
                            label="Description"
                            name="content"
                            suffix="100"
                          />
                        </div>
                      </div>
                      <div
                        className="Container"
                        style={{ margin: "0 0 16px 0" }}
                      >
                        <div className="Form-Align-Left">
                          <SectionSeparator2 title="Attachment" />
                          <Input
                            {...props}
                            label="Add Image"
                            name="image"
                            hint="Supported file formats: JPEG, JPG & PNG. File size max. 1MB with aspect ratio 2:1."
                            type="file"
                            optional
                          />
                          <Input
                            {...props}
                            label="Deep Link or Web Link"
                            name="link_url"
                            optional
                          />
                        </div>
                      </div>
                      <div
                        className="Container-dashboard"
                        style={{ margin: "0 0 16px 0" }}
                      >
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
                                className="col-12"
                                style={{ marginBottom: "8px" }}
                              >
                                *Only different filter can be saved!
                              </div>
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
                                  name="filter1"
                                  placeholder="Select Filter"
                                  options={[
                                    { label: "Age", value: "age" },
                                    { label: "Building", value: "building" },
                                    { label: "Gender", value: "gender" },
                                    { label: "Billing", value: "billing" },
                                  ]}
                                />
                              </div>
                              {values.filter1 === "age" ? (
                                <>
                                  <div
                                    className="col"
                                    style={{ maxWidth: 275, marginRight: 0 }}
                                  >
                                    <Input
                                      {...props}
                                      name="age_from"
                                      suffix="years"
                                      preText="From"
                                    />
                                  </div>
                                  <div
                                    className="col"
                                    style={{ maxWidth: 275 }}
                                  >
                                    <Input
                                      {...props}
                                      name="age_to"
                                      suffix="years"
                                      preText="To"
                                    />
                                  </div>
                                </>
                              ) : values.filter1 === "building" ? (
                                <>
                                  <div className="col">
                                    <Input
                                      {...props}
                                      name="building_id"
                                      type="select"
                                      placeholder="Select Building"
                                      options={buildings}
                                    />
                                  </div>
                                </>
                              ) : values.filter1 === "gender" ? (
                                <>
                                  <div className="col">
                                    <Input
                                      {...props}
                                      name="gender"
                                      type="radio"
                                      placeholder="Select Gender"
                                      options={[
                                        { label: "Male", value: "L" },
                                        { label: "Female", value: "P" },
                                      ]}
                                    />
                                  </div>
                                </>
                              ) : values.filter1 === "billing" ? (
                                <>
                                  <div className="col">
                                    <Input
                                      {...props}
                                      name="billing"
                                      type="select"
                                      placeholder="Select Billing Status"
                                      options={[
                                        { label: "Paid", value: "paid" },
                                        { label: "Unpaid", value: "unpaid" },
                                      ]}
                                    />
                                  </div>
                                </>
                              ) : (
                                []
                              )}
                            </div>
                            {values.filter1 !== "" && (
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
                                    name="filter2"
                                    placeholder="Select Filter"
                                    options={
                                      values.filter1 === "age"
                                        ? [
                                            {
                                              label: "Building",
                                              value: "building",
                                            },
                                            {
                                              label: "Gender",
                                              value: "gender",
                                            },
                                            {
                                              label: "Billing",
                                              value: "billing",
                                            },
                                          ]
                                        : values.filter1 === "building"
                                        ? [
                                            {
                                              label: "Age",
                                              value: "age",
                                            },
                                            {
                                              label: "Gender",
                                              value: "gender",
                                            },
                                            {
                                              label: "Billing",
                                              value: "billing",
                                            },
                                          ]
                                        : values.filter1 === "gender"
                                        ? [
                                            {
                                              label: "Age",
                                              value: "age",
                                            },
                                            {
                                              label: "Building",
                                              value: "building",
                                            },
                                            {
                                              label: "Billing",
                                              value: "billing",
                                            },
                                          ]
                                        : [
                                            {
                                              label: "Age",
                                              value: "age",
                                            },
                                            {
                                              label: "Building",
                                              value: "building",
                                            },
                                            {
                                              label: "Gender",
                                              value: "gender",
                                            },
                                          ]
                                    }
                                  />
                                </div>
                                {values.filter2 === "age" ? (
                                  <>
                                    <div
                                      className="col"
                                      style={{ maxWidth: 275, marginRight: 0 }}
                                    >
                                      <Input
                                        {...props}
                                        name="age_from"
                                        suffix="years"
                                        preText="From"
                                      />
                                    </div>
                                    <div
                                      className="col"
                                      style={{ maxWidth: 275 }}
                                    >
                                      <Input
                                        {...props}
                                        name="age_to"
                                        suffix="years"
                                        preText="To"
                                      />
                                    </div>
                                  </>
                                ) : values.filter2 === "building" ? (
                                  <>
                                    <div className="col">
                                      <Input
                                        {...props}
                                        name="building_id"
                                        type="select"
                                        placeholder="Select Building"
                                        options={buildings}
                                      />
                                    </div>
                                  </>
                                ) : values.filter2 === "gender" ? (
                                  <>
                                    <div className="col">
                                      <Input
                                        {...props}
                                        name="gender"
                                        type="radio"
                                        placeholder="Select Gender"
                                        options={[
                                          { label: "Male", value: "L" },
                                          { label: "Female", value: "P" },
                                        ]}
                                      />
                                    </div>
                                  </>
                                ) : values.filter2 === "billing" ? (
                                  <>
                                    <div className="col">
                                      <Input
                                        {...props}
                                        name="billing"
                                        type="select"
                                        placeholder="Select Billing Status"
                                        options={[
                                          { label: "Paid", value: "paid" },
                                          { label: "Unpaid", value: "unpaid" },
                                        ]}
                                      />
                                    </div>
                                  </>
                                ) : (
                                  []
                                )}
                              </div>
                            )}
                            {values.filter2 !== "" && (
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
                                    name="filter3"
                                    placeholder="Select Filter"
                                    options={
                                      (values.filter1 === "age" &&
                                        values.filter2 === "building") ||
                                      (values.filter1 === "building" &&
                                        values.filter2 === "age")
                                        ? [
                                            {
                                              label: "Gender",
                                              value: "gender",
                                            },
                                            {
                                              label: "Billing",
                                              value: "billing",
                                            },
                                          ]
                                        : (values.filter1 === "age" &&
                                            values.filter2 === "gender") ||
                                          (values.filter1 === "gender" &&
                                            values.filter2 === "age")
                                        ? [
                                            {
                                              label: "Building",
                                              value: "building",
                                            },
                                            {
                                              label: "Billing",
                                              value: "billing",
                                            },
                                          ]
                                        : (values.filter1 === "age" &&
                                            values.filter2 === "billing") ||
                                          (values.filter1 === "billing" &&
                                            values.filter2 === "age")
                                        ? [
                                            {
                                              label: "Building",
                                              value: "building",
                                            },
                                            {
                                              label: "Gender",
                                              value: "gender",
                                            },
                                          ]
                                        : (values.filter1 === "building" &&
                                            values.filter2 === "gender") ||
                                          (values.filter1 === "gender" &&
                                            values.filter2 === "building")
                                        ? [
                                            {
                                              label: "Age",
                                              value: "age",
                                            },
                                            {
                                              label: "Billing",
                                              value: "billing",
                                            },
                                          ]
                                        : (values.filter1 === "building" &&
                                            values.filter2 === "billing") ||
                                          (values.filter1 === "billing" &&
                                            values.filter2 === "building")
                                        ? [
                                            {
                                              label: "Age",
                                              value: "age",
                                            },
                                            {
                                              label: "Gender",
                                              value: "gender",
                                            },
                                          ]
                                        : (values.filter1 === "gender" &&
                                            values.filter2 === "billing") ||
                                          (values.filter1 === "billing" &&
                                            values.filter2 === "gender")
                                        ? [
                                            {
                                              label: "Age",
                                              value: "age",
                                            },
                                            {
                                              label: "Building",
                                              value: "building",
                                            },
                                          ]
                                        : [
                                            {
                                              label: "Age",
                                              value: "age",
                                            },
                                            {
                                              label: "Building",
                                              value: "building",
                                            },
                                          ]
                                    }
                                  />
                                </div>
                                {values.filter3 === "age" ? (
                                  <>
                                    <div
                                      className="col"
                                      style={{ maxWidth: 275, marginRight: 0 }}
                                    >
                                      <Input
                                        {...props}
                                        name="age_from"
                                        suffix="years"
                                        preText="From"
                                      />
                                    </div>
                                    <div
                                      className="col"
                                      style={{ maxWidth: 275 }}
                                    >
                                      <Input
                                        {...props}
                                        name="age_to"
                                        suffix="years"
                                        preText="To"
                                      />
                                    </div>
                                  </>
                                ) : values.filter3 === "building" ? (
                                  <>
                                    <div className="col">
                                      <Input
                                        {...props}
                                        name="building_id"
                                        type="select"
                                        placeholder="Select Building"
                                        options={buildings}
                                      />
                                    </div>
                                  </>
                                ) : values.filter3 === "gender" ? (
                                  <>
                                    <div className="col">
                                      <Input
                                        {...props}
                                        name="gender"
                                        type="radio"
                                        placeholder="Select Gender"
                                        options={[
                                          { label: "Male", value: "L" },
                                          { label: "Female", value: "P" },
                                        ]}
                                      />
                                    </div>
                                  </>
                                ) : values.filter3 === "billing" ? (
                                  <>
                                    <div className="col">
                                      <Input
                                        {...props}
                                        name="billing"
                                        type="select"
                                        placeholder="Select Billing Status"
                                        options={[
                                          { label: "Paid", value: "paid" },
                                          { label: "Unpaid", value: "unpaid" },
                                        ]}
                                      />
                                    </div>
                                  </>
                                ) : (
                                  []
                                )}
                              </div>
                            )}
                            {values.filter3 !== "" && (
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
                                    name="filter4"
                                    placeholder="Select Filter"
                                    options={
                                      (values.filter1 === "age" &&
                                        values.filter2 === "building" &&
                                        values.filter3 === "gender") ||
                                      (values.filter1 === "building" &&
                                        values.filter2 === "gender" &&
                                        values.filter3 === "age") ||
                                      (values.filter1 === "gender" &&
                                        values.filter2 === "age" &&
                                        values.filter3 === "building") ||
                                      (values.filter1 === "age" &&
                                        values.filter2 === "gender" &&
                                        values.filter3 === "building") ||
                                      (values.filter1 === "building" &&
                                        values.filter2 === "age" &&
                                        values.filter3 === "gender") ||
                                      (values.filter1 === "gender" &&
                                        values.filter2 === "building" &&
                                        values.filter3 === "age")
                                        ? [
                                            {
                                              label: "Billing",
                                              value: "billing",
                                            },
                                          ]
                                        : (values.filter1 === "billing" &&
                                            values.filter2 === "building" &&
                                            values.filter3 === "gender") ||
                                          (values.filter1 === "building" &&
                                            values.filter2 === "gender" &&
                                            values.filter3 === "billing") ||
                                          (values.filter1 === "gender" &&
                                            values.filter2 === "billing" &&
                                            values.filter3 === "building") ||
                                          (values.filter1 === "billing" &&
                                            values.filter2 === "gender" &&
                                            values.filter3 === "building") ||
                                          (values.filter1 === "building" &&
                                            values.filter2 === "billing" &&
                                            values.filter3 === "gender") ||
                                          (values.filter1 === "gender" &&
                                            values.filter2 === "building" &&
                                            values.filter3 === "billing")
                                        ? [
                                            {
                                              label: "Age",
                                              value: "age",
                                            },
                                          ]
                                        : (values.filter1 === "billing" &&
                                            values.filter2 === "age" &&
                                            values.filter3 === "gender") ||
                                          (values.filter1 === "age" &&
                                            values.filter2 === "gender" &&
                                            values.filter3 === "billing") ||
                                          (values.filter1 === "gender" &&
                                            values.filter2 === "billing" &&
                                            values.filter3 === "age") ||
                                          (values.filter1 === "billing" &&
                                            values.filter2 === "gender" &&
                                            values.filter3 === "age") ||
                                          (values.filter1 === "age" &&
                                            values.filter2 === "billing" &&
                                            values.filter3 === "gender") ||
                                          (values.filter1 === "gender" &&
                                            values.filter2 === "age" &&
                                            values.filter3 === "billing")
                                        ? [
                                            {
                                              label: "Building",
                                              value: "building",
                                            },
                                          ]
                                        : (values.filter1 === "age" &&
                                            values.filter2 === "billing" &&
                                            values.filter3 === "building") ||
                                          (values.filter1 === "billing" &&
                                            values.filter2 === "building" &&
                                            values.filter3 === "age") ||
                                          (values.filter1 === "building" &&
                                            values.filter2 === "age" &&
                                            values.filter3 === "billing") ||
                                          (values.filter1 === "age" &&
                                            values.filter2 === "building" &&
                                            values.filter3 === "billing") ||
                                          (values.filter1 === "billing" &&
                                            values.filter2 === "age" &&
                                            values.filter3 === "building")
                                        ? [
                                            {
                                              label: "Gender",
                                              value: "gender",
                                            },
                                          ]
                                        : [
                                            {
                                              label: "Select Filter",
                                              value: "",
                                            },
                                          ]
                                    }
                                  />
                                </div>
                                {values.filter4 === "age" ? (
                                  <>
                                    <div
                                      className="col"
                                      style={{ maxWidth: 275, marginRight: 0 }}
                                    >
                                      <Input
                                        {...props}
                                        name="age_from"
                                        suffix="years"
                                        preText="From"
                                      />
                                    </div>
                                    <div
                                      className="col"
                                      style={{ maxWidth: 275 }}
                                    >
                                      <Input
                                        {...props}
                                        name="age_to"
                                        suffix="years"
                                        preText="To"
                                      />
                                    </div>
                                  </>
                                ) : values.filter4 === "building" ? (
                                  <>
                                    <div className="col">
                                      <Input
                                        {...props}
                                        name="building_id"
                                        type="select"
                                        placeholder="Select Building"
                                        options={buildings}
                                      />
                                    </div>
                                  </>
                                ) : values.filter4 === "gender" ? (
                                  <>
                                    <div className="col">
                                      <Input
                                        {...props}
                                        name="gender"
                                        type="radio"
                                        placeholder="Select Gender"
                                        options={[
                                          { label: "Male", value: "L" },
                                          { label: "Female", value: "P" },
                                        ]}
                                      />
                                    </div>
                                  </>
                                ) : values.filter4 === "billing" ? (
                                  <>
                                    <div className="col">
                                      <Input
                                        {...props}
                                        name="billing"
                                        type="select"
                                        placeholder="Select Billing Status"
                                        options={[
                                          { label: "Paid", value: "paid" },
                                          { label: "Unpaid", value: "unpaid" },
                                        ]}
                                      />
                                    </div>
                                  </>
                                ) : (
                                  []
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      {selected.id && (
                        <div className="Form">
                          <SubmitButton loading={loading} errors={errors} />
                        </div>
                      )}
                      {!selected.id && (
                        <div
                          className="Container"
                          style={{ margin: "0 0 16px 0" }}
                        >
                          <div className="Form-Align-Left">
                            <>
                              <SectionSeparator2 title="Schedule" />
                              <Input
                                {...props}
                                required
                                type="radio"
                                name="scheduling_type"
                                label="Scheduling Options"
                                options={[
                                  {
                                    label: "Send at designated time",
                                    value: "is_schedule",
                                  },
                                  {
                                    label:
                                      "Send as soon as campaign is launched",
                                    value: "now",
                                  },
                                  {
                                    label: "Due Date Billing",
                                    value: "due_date_type",
                                  },
                                ]}
                              />
                              {values.scheduling_type === "is_schedule" ? (
                                <>
                                  <Input
                                    {...props}
                                    type="radio"
                                    name="scheduling_delivery"
                                    label="Set Delivery Schedule"
                                    hint="In case the user aggregation procedure takes time, actual notification delivery may be later than the time set here."
                                    options={[
                                      { label: "Once", value: "once" },
                                      { label: "Daily", value: "daily" },
                                      { label: "Weekly", value: "weekly" },
                                    ]}
                                  />
                                  {values.scheduling_delivery === "once" ? (
                                    <>
                                      <Input
                                        {...props}
                                        type="date"
                                        name="send_on"
                                        label="Send On"
                                      />
                                      <Input
                                        {...props}
                                        type="time"
                                        name="schedule_time"
                                        label="at time"
                                      />
                                    </>
                                  ) : values.scheduling_delivery === "daily" ? (
                                    <>
                                      <Input
                                        {...props}
                                        type="date"
                                        name="schedule_start"
                                        label="Start On"
                                      />
                                      <Input
                                        {...props}
                                        type="date"
                                        name="schedule_end"
                                        label="End On"
                                      />
                                      <Input
                                        {...props}
                                        type="time"
                                        name="schedule_time"
                                        label="at time"
                                      />
                                    </>
                                  ) : values.scheduling_delivery ===
                                    "weekly" ? (
                                    <>
                                      <Input
                                        {...props}
                                        type="select"
                                        name="day"
                                        label="Choose day"
                                        placeholder="Select day"
                                        options={weekDays}
                                      />
                                      <Input
                                        {...props}
                                        type="date"
                                        name="schedule_start"
                                        label="Start On"
                                      />
                                      <Input
                                        {...props}
                                        type="date"
                                        name="schedule_end"
                                        label="End On"
                                      />
                                      <Input
                                        {...props}
                                        type="time"
                                        name="schedule_time"
                                        label="at time"
                                      />
                                    </>
                                  ) : (
                                    []
                                  )}
                                </>
                              ) : values.scheduling_type === "due_date_type" ? (
                                <>
                                  <Input
                                    {...props}
                                    type="select"
                                    name="due_date"
                                    label="Choose day"
                                    options={dueDate}
                                  />
                                </>
                              ) : (
                                []
                              )}
                            </>
                            <div className="Form">
                              <SubmitButton loading={loading} errors={errors} />
                            </div>
                          </div>
                        </div>
                      )}
                    </CardBody>
                  </Card>
                </Column>
                <Column style={{ flex: "3", display: "block" }}>
                  <Card
                    style={{
                      marginBottom: "20px",
                      borderRadius: 6,
                      border: 0,
                      boxShadow: "none",
                      background: "transparent",
                    }}
                  >
                    <CardBody>
                      <div
                        className="Container"
                        style={{ margin: "0 0 16px 0" }}
                      >
                        <div>
                          <p className="Separator2Label">Preview</p>
                          <p style={{ color: "#5A5A5A", fontSize: 12 }}>
                            Actual appearance of push notification may differ.
                          </p>
                          <hr />
                          <p
                            className="Separator2Label"
                            style={{ fontSize: "14px" }}
                          >
                            Preview Type
                          </p>
                          <div>
                            <Input
                              {...props}
                              type="radio"
                              name="preview"
                              options={[
                                { label: "iOS", value: "ios" },
                                { label: "Android", value: "android" },
                              ]}
                            />
                          </div>
                          {values.preview == "android" ? (
                            <div className="text-center">
                              <img
                                src={require("./../../../assets/adnroid_prev.jpg")}
                                style={{
                                  maxHeight: 300,
                                  width: "auto",
                                  marginTop: 16,
                                  marginBottom: 16,
                                  borderRadius: 6,
                                }}
                              />
                            </div>
                          ) : (
                            <div className="text-center">
                              <img
                                src={require("./../../../assets/ios_prev.jpg")}
                                style={{
                                  maxHeight: 300,
                                  width: "auto",
                                  marginTop: 16,
                                  marginBottom: 16,
                                  borderRadius: 6,
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Column>
              </Row>
            </Form>
          </Column>
        );
      }}
    />
  );
}

export default Component;
