import React, { useState, useEffect } from "react";
import { FiMapPin } from "react-icons/fi";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import GoogleMapReact from "google-map-react";

import Modal from "../../components/Modal";
import SectionSeparator from "../../components/SectionSeparator";
import {
  endpointAdmin,
  endpointMerchant,
  banks,
} from "../../settings";
import { createMerchant, editMerchant } from "../slices/merchant";
import { get } from "../slice";

import Template from "./components/TemplateWithFormik";
import { Form } from 'formik';
import { merchantSchema } from "./schemas";
import Input from './input';

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
    <Template
      slice="merchant"
      payload={selected.id ? {...merchantPayload, ...selected, 
        phone: selected.phone.slice(2),
        pic_phone: selected.pic_phone.slice(2),
      } : merchantPayload}
      schema={merchantSchema}
      formatValues={values => ({
        ...values,
        phone: '62' + values.phone,
        pic_phone: '62' + values.pic_phone,
      })}
      edit={data => dispatch(editMerchant(data, history, selected.id))}
      add={data => dispatch(createMerchant(data, history))}
      renderChild={props => {
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
                { value: "individual", label: "Individual" },
                { value: "company", label: "Company" },
              ]}
            />
            <Input {...props}
              label="Category"
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
    />
  );
}

export default Component;
