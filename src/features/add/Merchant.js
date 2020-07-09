import React, { useState, useEffect } from "react";

import Input from "../../components/Input";
import Modal from "../../components/Modal";
import SectionSeparator from "../../components/SectionSeparator";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  endpointAdmin,
  endpointMerchant,
  banks,
} from "../../settings";
import { createMerchant, editMerchant } from "../slices/merchant";
import GoogleMapReact from "google-map-react";
import { FiMapPin } from "react-icons/fi";
import { get } from "../slice";
import Template from "./components/Template";

import { Formik, Form } from 'formik';
import * as Yup from 'yup';

const defaultRequiredError = 'This field is required.';

const Text = Yup.string().required(defaultRequiredError);

const TextOptional = Yup.string();

const Phone = Yup.string()
  .matches(/^(0*[1-9][0-9]*(\.[0-9]*)?|0*\.[0-9]*[1-9][0-9]*)$/, "Phone number should not contain unnecesarry characters.")
  .max(14, "Phone number must be less than 14.")
  .min(11, "Phone number more than 11.")
  .required(defaultRequiredError);

const Email = Yup.string().email('Invalid email').required(defaultRequiredError);

const merchantSchema = Yup.object().shape({
  "name": Text,
  "phone": Phone,
  "type": Text,
  "legal": Text,
  "category": Text,
  "status": Text,
  "description": Text,
  "in_building": TextOptional,
  "lat": Text,
  "long": Text,
  "address": Text,
  "pic_name": Text,
  "pic_phone": Phone,
  "pic_mail": Email,
  "account_bank": Text,
  "account_no": Text,
  "account_name": Text,
});

const merchantPayload = {
  "name": "",
  "type": "goods",
  "legal": "individual",
  "category": "",
  "phone": "",
  "status": "inactive",
  "description": "",
  "in_building": 0,
  "address": "",
  "lat": "",
  "long": "",
  "pic_name": "",
  "pic_phone": "",
  "pic_mail": "",
  "account_bank": "",
  "account_no": "",
  "account_name": "",
  "category_label": "",
  "in_building_label": "None",
  "account_bank_label": "",
}

function Component() {
  const [modal, setModal] = useState(false);

  const [inBuildings, setBuildings] = useState([]);
  const [categories, setCategories] = useState([]);

  const { loading, selected } = useSelector((state) => state.merchant);

  let dispatch = useDispatch();
  let history = useHistory();

  useEffect(() => {
    dispatch(get(endpointAdmin + "/building?page=1&limit=9999", (res) => {
      let formatted = res.data.data.items.map((el) => ({
        label: el.name,
        value: el.id,
        lat: el.lat,
        long: el.long,
      }));
      setBuildings(formatted);
    }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(get(endpointMerchant + "/admin/categories", (res) => {
      let formatted = res.data.data.map((el) => ({
        label: el.name,
        value: el.name,
      }));
      setCategories(formatted);
    }));
  }, [dispatch]);

  return (
    <Template>
      <Formik
        initialValues={selected.id ? {
          ...selected,
          "category_label": selected.category,
          "in_building_label": selected.in_building,
          "account_bank_label": selected.account_bank,
        } : merchantPayload}
        validationSchema={merchantSchema}
        onSubmit={(values) => {
          const data = { ...values, phone: '+62' + values.phone };

          console.log(data);

          selected.id ?
            dispatch(editMerchant(data, history, selected.id))
            :
            dispatch(createMerchant(data, history));
        }}
      >
        {props => {
          const { setFieldValue, values } = props;
          // console.log(rest);
          return (
            <Form className="Form">
              <Modal isOpen={modal} toggle={() => {
                setModal(false);
              }} onClick={() => setModal(false)} okLabel={"Select"}>
                <div style={{ height: '40rem', width: '100%' }}>
                  <GoogleMapReact
                    bootstrapURLKeys={{ key: 'AIzaSyB2COXmiUjYMi651In_irBIHaKnT17L_X8' }}
                    defaultCenter={{
                      lat: -6.2107863,
                      lng: 106.8137977,
                    }}
                    zoom={12}
                    onClick={({ x, y, lat, lng, event }) => {
                      setFieldValue('lat', lat);
                      setFieldValue('long', lng);
                      console.log(lat, lng);
                    }}
                    onChange={({ center }) => {
                      setFieldValue('lat', center.lat);
                      setFieldValue('long', center.lng);
                      console.log(center.lat, center.lng);
                    }}
                  >
                    <div style={{
                      position: 'absolute',
                      transform: 'translate(-50%, -50%)'
                    }}>
                      <FiMapPin size={40} color="dodgerblue" />
                    </div>
                  </GoogleMapReact>
                </div>
              </Modal>

              <Input {...props} label="Name" />
              <Input {...props} label="Phone" prefix="+62" />
              <Input {...props} label="Type"
                type="radio"
                options={[
                  { value: "goods", label: "Goods" },
                  { value: "services", label: "Services" },
                ]}
              />
              <Input {...props} label="Legal"
                type="radio"
                options={[
                  { value: "individual", label: "Individu" },
                  { value: "company", label: "Perusahaan" },
                ]}
              />
              <Input {...props}
                label="Category"
                type="select"
                options={categories}
              />
              <Input {...props} label="Status" type="radio"
                options={[
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                ]}
              />
              <Input {...props} label="Description" type="textarea" />

              <SectionSeparator />

              <Input
                {...props}
                optional
                label="Building"
                type="select"
                name="in_building"
                options={inBuildings}
                onChange={el => {
                  console.log(el);
                  setFieldValue('lat', el.lat);
                  setFieldValue('long', el.long);
                }}
              />
              {!values['in_building'] &&
                <button type="button" onClick={() => setModal(true)}>
                  Select Location
                </button>
              }
              <Input {...props} label="Latitude" name="lat" />
              <Input {...props} label="Longitude" name="long" />
              <Input {...props} label="Address" type="textarea" />

              <SectionSeparator />

              <Input {...props} label="PIC Name" />
              <Input {...props} label="PIC Phone" prefix="+62" />
              <Input {...props} label="PIC Mail" />

              <SectionSeparator />

              <Input {...props} label="Bank Account" name="account_bank" options={banks} />
              <Input {...props} label="Bank Account Number" name="account_no" />
              <Input {...props} label="Bank Account Name" name="account_name" />
              {!loading &&
                <button type="submit"
                  onClick={() => console.log(values)}
                >
                  Submit
                </button>
              }
            </Form>
          )
        }}
      </Formik>
    </Template>
  );
}

export default Component;
