import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { GoogleMap } from "@react-google-maps/api";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { FiMapPin } from "react-icons/fi";

import SectionSeparator from "../../components/SectionSeparator";
import Modal from "../../components/Modal";
import { createBuilding, editBuilding } from "../slices/building";
import { endpointResident } from "../../settings";
import { get } from "../slice";

import Template from "./components/TemplateWithFormik";
import Input from "./input";
import { Form } from "formik";
import { buildingSchema } from "./services/schemas";
import SubmitButton from "./components/SubmitButton";
// import { auth } from 'firebase';

const buildingPayload = {
  name: "",
  legal_name: "",
  code_name: "",
  logo: "",
  website: "",
  owner_name: "",
  phone: "",
  email: "",
  max_sections: "",
  max_floors: "",
  max_units: "",
  lat: "",
  long: "",
  address: "",
  zipcode: "",
  province: "",
  city: "",
  district: "",
  province_label: "",
  city_label: "",
  district_label: "",
  auto_answer: "",
  auto_answer_text: "",
};

function Component() {
  const { auth } = useSelector((state) => state);
  const { selected, loading } = useSelector((state) => state.building);
  const { role } = useSelector((state) => state.auth);
  const [autoAnswer, setAutoAnswer] = useState("n");

  const [modal, setModal] = useState(false);
  const [districts, setDistricts] = useState([]);

  const [address, setAddress] = useState("");
  const [center, setCenter] = useState(
    selected?.lat
      ? {
          lat: selected.lat,
          lng: selected.long,
        }
      : null
  );

  const [city, setCity] = useState("");
  const [cities, setCities] = useState([]);

  const [province, setProvince] = useState("");
  const [provinces, setProvinces] = useState([]);

  let dispatch = useDispatch();
  let history = useHistory();

  useEffect(() => {
    dispatch(
      get(
        endpointResident + "/geo/province",

        (res) => {
          let formatted = res.data.data.map((el) => ({
            label: el.name,
            value: el.id,
          }));
          setProvinces(formatted);
        }
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setCity("");
    (province || selected.province) &&
      dispatch(
        get(
          endpointResident +
            "/geo/province/" +
            (province ? province : selected.province),

          (res) => {
            let formatted = res.data.data.map((el) => ({
              label: el.name,
              value: el.id,
            }));
            setCities(formatted);
          }
        )
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [province, selected.province]);

  useEffect(() => {
    (city || selected.city) &&
      dispatch(
        get(
          endpointResident + "/geo/city/" + (city ? city : selected.city),

          (res) => {
            let formatted = res.data.data.map((el) => ({
              label: el.name,
              value: el.id,
            }));
            setDistricts(formatted);
          }
        )
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city, selected.city]);

  useEffect(() => {
    console.log(selected.auto_answer);
    setAutoAnswer(selected.auto_answer);
  }, [selected.auto_answer]);

  return (
    <Template
      slice="building"
      payload={
        selected.id
          ? {
              ...buildingPayload,
              ...selected,
              phone: selected.phone.slice(2),
            }
          : buildingPayload
      }
      schema={buildingSchema}
      formatValues={(values) => ({
        ...values,
        phone: "62" + values.phone,
        max_sections: parseInt(values.max_sections, 10),
        max_floors: parseInt(values.max_floors, 10),
        max_units: parseInt(values.max_units, 10),
        zipcode: parseInt(values.zipcode),
        province_name: values.province_label,
        city_name: values.city_label,
        district_name: values.district_label,
        lat: parseFloat(values.lat),
        long: parseFloat(values.long),
      })}
      edit={(data) => {
        const newData = data;
        if (data.auto_answer == "n") {
          data.auto_answer_text = " ";
          data.auto_answer_image = " ";
          data.auto_answer_from = " ";
        }
        dispatch(editBuilding(data, history, selected.id, auth.role));
      }}
      add={(data) => dispatch(createBuilding(data, history))}
      renderChild={(props) => {
        const { setFieldValue, values, errors } = props;

        return (
          <Form className="Form">
            <Input
              {...props}
              label="Auto Answer Feature"
              name="auto_answer"
              type="radio"
              onChange={(val) => setAutoAnswer(val)}
              options={[
                { value: "y", label: "Active" },
                { value: "n", label: "Inactive" },
              ]}
            />
            {autoAnswer === "y" && (
              <>
                <Input
                  {...props}
                  label="Auto Answer From"
                  name="auto_answer_from"
                />
                <Input
                  {...props}
                  type="file"
                  label="Image (optional)"
                  name="auto_answer_image"
                  placeholder="Image URL"
                />
                <Input
                  {...props}
                  type="editor"
                  label="Auto Answer Text"
                  placeholder="Insert Announcement Description"
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
