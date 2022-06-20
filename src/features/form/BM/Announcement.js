import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { endpointAdmin } from "../../../settings";
import {
  createAnnouncement,
  editAnnouncement,
} from "../../slices/announcement";
import { get } from "../../slice";

import Template from "../components/TemplateWithFormik";
import Input from "../input";
import { Form } from "formik";
import { announcementSchema } from "../services/schemas";
import SubmitButton from "../components/SubmitButton";
import moment from "moment";
import { inputDateTimeFormatter24, toSentenceCase, updateDateTimeFormatter } from "../../../utils";

const announcementPayload = {
  title: "",
  target_building: "specificbuilding",
  target_merchant: "allmerchant",
  target_unit: "allunit",
  building_section_floor: [],
  building: [],
  consumer_role: "",
  image: "",
  description: "",
  building_unit: [],
  merchant: [],
  publish_schedule: "",
  scheduled: "n",
};

const roles = [
  { value: "resident", label: "Resident" },
  { value: "management", label: "Building Management PIC & GM" },
  { value: "staff", label: "Building Staff (Security, Technician)" },
  // TODO : need to reactivate if staff courier is already implemented on business operational
  // { value: 'staff_courier', label: 'Staff Courier Only' },
  { value: "staff_security", label: "Staff Security Only" },
  { value: "staff_technician", label: "Staff Technician Only" },
];

const target_units = [
  { label: "All Unit", value: "allunit" },
  { label: "Specific Unit(s)", value: "specificunit" },
  { label: "Specific Section(s) & Floor(s)", value: "specificsectionandfloor" },
];

function Component() {
  const { selected, loading } = useSelector((state) => state.announcement);
  const { user } = useSelector((state) => state.auth);

  const [selectedSections, setSelectedSections] = useState([]);
  const [sections, setSections] = useState([]);
  const [searchSection, setSearchSection] = useState("");

  const [selectedSectionsFloors, setSelectedSectionsFloors] = useState([]);
  const [sectionsFloors, setSectionsFloors] = useState([]);
  const [searchSectionFloor, setSearchSectionFloor] = useState("");

  const [units, setUnits] = useState([]);
  const [searchUnit, setSearchUnit] = useState("");

  // const [floor, setFloor] = useState([]);

  let dispatch = useDispatch();
  let history = useHistory();

  useEffect(() => {
    let queryString =
      "/building/unit?building_id=" +
      user.building_id +
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
    searchUnit.length > 1 &&
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
  }, [dispatch, searchUnit, user.building_id]);

  //section search
  useEffect(() => {
    dispatch(
      get(
        endpointAdmin +
          "/building/section?building_id=" +
          user.building_id +
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
  }, [dispatch, searchSection, user]);

  // section floor
  useEffect(() => {
    dispatch(
      get(
        endpointAdmin +
          "/building/sectionfloor?building_id=" +
          user.building_id +
          "&limit=100&page=1" +
          "&search=" +
          searchSectionFloor,
        (res) => {
          let data = res.data.data.items;

          let formatted = data.map((el) => ({
            label: `${toSentenceCase(el.section_type)} ${toSentenceCase(
              el.section_name
            )}` + ', Floor ' + el.floor,
            value: el.id,
            section_value: el.section_id,
            floor_value: el.floor,
          }));

          setSectionsFloors(formatted);
        }
      )
    );
  }, [dispatch, searchSectionFloor, user]);

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
        target_unit:
          selected.building_unit && selected.building_unit.length > 0
            ? "specificunit" 
            :
            selected.building_section_floor && selected.building_section_floor.length > 0
            ? "specificsectionandfloor"
            : "allunit",
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
            label: "Room " + el.number + ", Section: " + el.section_name,
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
        building_section_floor:
          selected.building_section_floor &&
          selected.building_section_floor.map((el) => ({
            label: `${toSentenceCase(el.section_type)} ${toSentenceCase(
              el.section_name
            )}` + ', Floor ' + el.floor,
            value: el.building_section_floor_id,
          })),
        publish_schedule: selected.publish_schedule ? updateDateTimeFormatter(selected.publish_schedule) : "2022-01-01T06:00:01",
      }
    : {
        ...announcementPayload,
        target_building: "specificbuilding",
        building: [{ label: user.building_name, value: user.building_id }],
      };

  return (
    <>
      <Template
        slice="announcement"
        payload={payload}
        schema={announcementSchema}
        formatValues={(values) => ({
          ...values,
          building: [user.building_id],
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
          building_section_floor:
            values.consumer_role !== "resident" || values.building.length !== 1
              ? []
              : typeof values.building_section_floor !== "undefined"
              ? values.building_section_floor.map((el) => ({
                  building_section_floor_id : el.value,
                  building_id: values.building[0].value,
                  building_section_id: el.section_value,
                  floor: el.floor_value,
                }))
              : [],
          merchant:
            values.consumer_role === "merchant"
              ? values.merchant.map((el) => el.value)
              : [],
          publish_schedule: inputDateTimeFormatter24(values.publish_schedule),
        })}
        edit={(data) => {
          //console.log(data);
          dispatch(editAnnouncement(data, history, selected.id, "bm"));
        }}
        add={(data) => {
          //console.log(data);
          delete data[undefined];
          dispatch(createAnnouncement(data, history, "bm"));
        }}
        renderChild={(props) => {
          const { setFieldValue, values, errors } = props;

          return (
            <Form className="Form">
              <Input
                {...props}
                type="select"
                label="Consumer Role"
                autoComplete="off"
                placeholder="Select Consumer Role"
                options={roles}
              />
              {values.consumer_role === "resident" && (
                <Input
                  {...props}
                  label="Target Unit"
                  name="target_unit"
                  type="radio"
                  options={target_units}
                  onChange={(el) => setFieldValue(el.value)}
                />
              )}
              {values.consumer_role === "resident" &&
                values.target_unit === "specificunit" && (
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
                      "Selecting section is only valid when consumer is resident and not selecting any unit on below form.  " +
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
                values.target_unit === "specificunit" && (
                  <Input
                    {...props}
                    type="multiselect"
                    label="Select Unit(s)"
                    name="building_unit"
                    onInputChange={(e, value) =>
                      value === "" ? setUnits([]) : setSearchUnit(value)
                    }
                    defaultValue={values.building_unit}
                    placeholder="Start typing room number to add"
                    options={units}
                  />
                )}
                {values.consumer_role === "resident" &&
                values.target_unit === "specificsectionandfloor" && (
                  <Input
                    {...props}
                    type="multiselect"
                    label="Select Section(s) & Floor(s)"
                    name="building_section_floor"
                    onInputChange={(e, value) =>
                      value === "" ? setSectionsFloors([]) : setSearchSectionFloor(value)
                    }
                    defaultValue={values.building_section_floor_id}
                    // hint={
                    //   "Selecting section is only valid when consumer is resident and not selecting any unit on below form.  " +
                    //   "Not specifying section means targeting the announcement for all resident on all section."
                    // }
                    placeholder="Start typing section name to add"
                    options={sectionsFloors}
                    onChange={(e, value) => {
                      // if there's change in selected buildings, clear units
                      //   if (value !== selectedSections) {
                      //     setFieldValue("building_unit", []);
                      //   }
                      setSelectedSectionsFloors(value);
                    }}
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
                optional
                placeholder="Image URL"
                hint="Preferred size for maximum result is 1:2"
              />
              <Input
                {...props}
                type="radio"
                label="Scheduling"
                name="scheduled"
                options={[
                  { value: "y", label: "Yes"},
                  { value: "n", label: "No"},
                ]} 
              />
              {values.scheduled === "y" ?
              <Input
                {...props}
                type="datetime-local"
                label="Publish Schedule"
                name="publish_schedule"
              />
              :
              []
              }
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
