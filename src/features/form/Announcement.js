import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { endpointAdmin, endpointMerchant } from "../../settings";
import { createAnnouncement, editAnnouncement } from "../slices/announcement";
import { get } from "../slice";

import Template from "./components/TemplateWithFormik";
import Input from "./input";
import { Form } from "formik";
import { announcementSchema } from "./services/schemas";
import SubmitButton from "./components/SubmitButton";
import { toSentenceCase } from "../../utils";

const announcementPayload = {
  title: "",
  target_building: "allbuilding",
  target_merchant: "allmerchant",
  building: [],
  consumer_role: "",
  image: "",
  description: "",
  building_unit: [],
  merchant: [],
};

const roles = [
  { value: "centratama", label: "Centratama" },
  { value: "management", label: "Building Management PIC & GM" },
  { value: "staff", label: "Building Staff (Courier, Security, Technician)" },
  { value: "staff_courier", label: "Staff Courier Only" },
  { value: "staff_security", label: "Staff Security Only" },
  { value: "staff_technician", label: "Staff Technician Only" },
  { value: "resident", label: "Resident" },
  { value: "merchant", label: "Merchant" },
];

const target_buildings = [
  { label: "All Building", value: "allbuilding" },
  { label: "Specific Building(s)", value: "specificbuilding" },
];

const target_merchants = [
  { label: "All Merchant", value: "allmerchant" },
  { label: "Specific Merchant(s)", value: "specificmerchant" },
];

function Component() {
  const { selected, loading } = useSelector((state) => state.announcement);

  const [buildings, setBuildings] = useState([]);
  const [selectedBuildings, setSelectedBuildings] = useState(
    selected.building ? selected.building : []
  );
  const [selectedSections, setSelectedSections] = useState([]);

  const [units, setUnits] = useState([]);
  const [sections, setSections] = useState([]);

  const [searchbuilding, setSearchbuilding] = useState("");
  const [searchSection, setSearchSection] = useState("");
  const [searchUnit, setSearchUnit] = useState("");

  const [searchmerchant, setSearchmerchant] = useState("");
  const [merchants, setMerchants] = useState([]);

  let dispatch = useDispatch();
  let history = useHistory();

  useEffect(() => {
    searchmerchant.length > 1 &&
      dispatch(
        get(
          endpointMerchant +
            "/admin/list" +
            "?limit=5&page=1" +
            "&search=" +
            searchmerchant,
          (res) => {
            let data = res.data.data.items;

            let formatted = data.map((el) => ({
              label: el.name,
              value: el.id,
            }));

            console.log(formatted);
            setMerchants(formatted);
          }
        )
      );
  }, [dispatch, searchmerchant]);

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

  //unit search
  useEffect(() => {
    if (selectedBuildings.length === 0) return;

    /* We might have different structure we got from selected or from multiselect input */
    let buildingid = selectedBuildings[0].building_id
      ? selectedBuildings[0].building_id
      : selectedBuildings[0].value;

    if (selectedBuildings.length === 1 && searchUnit.length > 1) {
      let queryString =
        "/building/unit?building_id=" +
        buildingid +
        "&limit=5&page=1" +
        "&search=" +
        searchUnit;
      if (selectedSections.length > 0) {
        let sectArr = [];
        selectedSections.map((item) => sectArr.push(item.value));
        let sectJoin = sectArr.join(",");
        console.log(sectJoin);
        queryString += `&building_section=${sectJoin}`;
      }
      dispatch(
        get(endpointAdmin + queryString, (res) => {
          let data = res.data.data.items;

          let formatted = data.map((el) => ({
            label:
              toSentenceCase(el.section_type) +
              " " +
              toSentenceCase(el.section_name) +
              ", Unit " +
              el.number,
            value: el.id,
          }));

          setUnits(formatted);
        })
      );
    }
  }, [dispatch, searchUnit, selectedSections, selectedBuildings]);

  //section search
  useEffect(() => {
    if (selectedBuildings.length === 0) return;

    /* We might have different structure we got from selected or from multiselect input */
    let buildingid = selectedBuildings[0].building_id
      ? selectedBuildings[0].building_id
      : selectedBuildings[0].value;

    selectedBuildings.length === 1 &&
      searchSection.length > 1 &&
      dispatch(
        get(
          endpointAdmin +
            "/building/section?building_id=" +
            buildingid +
            "&limit=5&page=1" +
            "&search=" +
            searchSection,
          (res) => {
            let data = res.data.data.items;

            let formatted = data.map((el) => ({
              label: `${toSentenceCase(el.section_type)} ${toSentenceCase(
                el.section_name
              )}`,
              value: el.id,
            }));

            setSections(formatted);
          }
        )
      );
  }, [dispatch, searchSection, selectedBuildings]);

  const payload = selected.id
    ? {
        ...announcementPayload,
        ...selected,
        title: selected.duplicate
          ? "Duplicate of " + selected.title
          : selected.title,
        duplicate: selected.duplicate,
        /* when it's editing, the format from server isn't the same as we expected, so we need to reformat again */
        target_building:
          selected.building && selected.building.length > 0
            ? "specificbuilding"
            : "allbuilding",
        target_merchant:
          selected.merchant && selected.merchant.length > 0
            ? "specificmerchant"
            : "allmerchant",
        merchant:
          selected.merchant &&
          selected.merchant.map((el) => ({
            label: el.merchant_name,
            value: el.id,
          })),
        building:
          selected.building &&
          selected.building.map((el) => ({
            label: el.building_name,
            value: el.building_id,
          })),
        building_unit:
          selected.building_unit &&
          selected.building_unit.map((el) => ({
            label:
              toSentenceCase(el.section_type) +
              " " +
              toSentenceCase(el.section_name) +
              ", Room " +
              el.number,
            value: el.building_unit_id,
          })),
        building_section:
          selected.building_section &&
          selected.building_section.map((el) => ({
            label: `${toSentenceCase(el.section_type)} ${toSentenceCase(
              el.section_name
            )}`,
            value: el.building_section_id,
          })),
      }
    : announcementPayload;

  return (
    <>
      <Template
        slice="announcement"
        payload={payload}
        schema={announcementSchema}
        formatValues={(values) => ({
          ...values,
          building:
            values.consumer_role === "centratama" ||
            values.consumer_role === "merchant"
              ? []
              : values.building.map((el) => el.value),
          building_unit:
            values.consumer_role !== "resident" || values.building.length !== 1
              ? []
              : values.building_unit.map((el) => ({
                  building_id: values.building[0].value,
                  building_unit_id: el.value,
                })),
          building_section:
            values.consumer_role !== "resident" || values.building.length !== 1
              ? []
              : typeof values.building_section !== "undefined"
              ? values.building_section.map((el) => ({
                  building_id: values.building[0].value,
                  building_section_id: el.value,
                }))
              : [],
          merchant:
            values.consumer_role === "merchant"
              ? values.merchant.map((el) => el.value)
              : [],
        })}
        edit={(data) => {
          //console.log(data);
          dispatch(editAnnouncement(data, history, selected.id, "sa"));
        }}
        add={(data) => {
          //console.log(data);
          dispatch(createAnnouncement(data, history, "sa"));
        }}
        renderChild={(props) => {
          const { setFieldValue, values, errors } = props;

          return (
            <Form className="Form">
              <Input
                {...props}
                type="select"
                label="Consumer Role"
                placeholder="Select Consumer Role"
                options={roles}
              />
              {values.consumer_role.length > 0 &&
                values.consumer_role !== "centratama" &&
                values.consumer_role !== "merchant" && (
                  <Input
                    {...props}
                    label="Target Building"
                    name="target_building"
                    type="radio"
                    options={target_buildings}
                    defaultValue="allbuilding"
                    onChange={(el) => {
                      el === "allbuilding" && setFieldValue("building", []);
                    }}
                  />
                )}
              {values.consumer_role.length > 0 &&
                values.consumer_role === "merchant" && (
                  <Input
                    {...props}
                    label="Target Merchant"
                    name="target_merchant"
                    type="radio"
                    options={target_merchants}
                    onChange={(el) => setFieldValue(el.value)}
                  />
                )}
              {values.target_building === "specificbuilding" &&
                values.consumer_role !== "merchant" &&
                values.consumer_role !== "centratama" && (
                  <Input
                    {...props}
                    type="multiselect"
                    label="Select Building(s)"
                    name="building"
                    defaultValue={values.building}
                    placeholder="Start typing building name to add"
                    options={buildings}
                    onInputChange={(e, value) =>
                      value === "" ? setBuildings([]) : setSearchbuilding(value)
                    }
                    onChange={(e, value) => {
                      // if there's change in selected buildings, clear units
                      if (value !== selectedBuildings) {
                        setFieldValue("building_unit", []);
                      }
                      setSelectedBuildings(value);
                    }}
                  />
                )}
              {values.target_merchant === "specificmerchant" &&
                values.consumer_role === "merchant" && (
                  <Input
                    {...props}
                    type="multiselect"
                    label="Select Merchant(s)"
                    name="merchant"
                    defaultValue={values.merchant}
                    placeholder="Start typing merchant name to add"
                    options={merchants}
                    onInputChange={(e, value) =>
                      value === "" ? setMerchants([]) : setSearchmerchant(value)
                    }
                  />
                )}
              {values.consumer_role === "resident" &&
                values.building.length === 1 &&
                values.target_building === "specificbuilding" && (
                  <Input
                    {...props}
                    type="multiselect"
                    label="Select Section(s)"
                    name="building_section"
                    onInputChange={(e, value) =>
                      value === "" ? setSections([]) : setSearchSection(value)
                    }
                    defaultValue={values.building_section}
                    hint={
                      "Selecting section is only valid when consumer is resident and when selecting only 1 building.  " +
                      "Not specifying section means targeting the announcement for all resident on all section."
                    }
                    placeholder="Start typing room number to add"
                    options={sections}
                    onChange={(e, value) => {
                      // if there's change in selected buildings, clear units
                      //   if (value !== selectedSections) {
                      //     setFieldValue("building_unit", []);
                      //   }
                      setSelectedSections(value);
                    }}
                  />
                )}
              {values.consumer_role === "resident" &&
                values.building.length === 1 &&
                values.target_building === "specificbuilding" && (
                  <Input
                    {...props}
                    type="multiselect"
                    label="Select Unit(s)"
                    name="building_unit"
                    onInputChange={(e, value) =>
                      value === "" ? setUnits([]) : setSearchUnit(value)
                    }
                    defaultValue={values.building_unit}
                    hint={
                      "Selecting unit is only valid when consumer is resident and when selecting only 1 building.  " +
                      "Not specifying unit means targeting the announcement for all resident."
                    }
                    placeholder="Start typing room number to add"
                    options={units}
                  />
                )}
              <Input
                {...props}
                label="Title"
                placeholder="Input Announcement Title"
                name="title"
              />
              <Input
                {...props}
                type="file"
                label="Image Header"
                name="image"
                placeholder="Image URL"
                hint="Image ratio must be 1:2"
              />
              <Input
                {...props}
                type="editor"
                label="Description"
                placeholder="Insert Announcement Description"
              />
              <SubmitButton loading={loading} errors={errors} />
            </Form>
          );
        }}
      />
    </>
  );
}

export default Component;
