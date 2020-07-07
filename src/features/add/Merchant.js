import React, { useState, useEffect } from "react";

import Input from "../../components/Input";
import Form from "../../components/Form";
import Modal from "../../components/Modal";
import SectionSeparator from "../../components/SectionSeparator";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  endpointResident,
  endpointAdmin,
  endpointMerchant,
  banks,
} from "../../settings";
import { createMerchant, editMerchant } from "../slices/merchant";
import GoogleMapReact from "google-map-react";
import { FiMapPin } from "react-icons/fi";
import { get } from "../slice";
import Template from "./components/Template";

function Component() {
  const [modal, setModal] = useState(false);
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');

  const [district, setDistrict] = useState("");
  const [districts, setDistricts] = useState([]);

  const [city, setCity] = useState("");

  const [cities, setCities] = useState([]);

  const [province, setProvince] = useState("");
  const [provinces, setProvinces] = useState([]);

  const [inBuilding, setBuilding] = useState();
  const [inBuildings, setBuildings] = useState([]);

  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);


  const { loading, selected } = useSelector((state) => state.merchant);

  let dispatch = useDispatch();
  let history = useHistory();

  useEffect(() => {
    setBuilding("");
    dispatch(get(endpointAdmin + "/building?page=1&limit=9999", (res) => {
      let formatted = res.data.data.items.map((el) => ({
        label: el.name,
        value: el.id,
      }));
      setBuildings(formatted);
    }));
  }, [dispatch]);

  useEffect(() => {
    setCategory("");
    dispatch(get(endpointMerchant + "/admin/categories", (res) => {
      let formatted = res.data.data.map((el) => ({
        label: el.name,
        value: el.name,
      }));
      setCategories(formatted);
    }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(get(endpointResident + "/geo/province", (res) => {
      let formatted = res.data.data.map((el) => ({
        label: el.name,
        value: el.id,
      }));
      setProvinces(formatted);
    }));
  }, [dispatch]);

  useEffect(() => {
    setCity("");
    (province || selected.province) &&
      dispatch(get(
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
      ));
  }, [dispatch, province, selected.province]);

  useEffect(() => {
    setDistrict("");
    (city || selected.city) &&
      dispatch(get(
        endpointResident + "/geo/city/" + (city ? city : selected.city),

        (res) => {
          let formatted = res.data.data.map((el) => ({
            label: el.name,
            value: el.id,
          }));
          setDistricts(formatted);
        }
      ));
  }, [city, dispatch, selected.city]);

  return (
    <Template>
      <Modal isOpen={modal} toggle={() => {
        setLat('');
        setLng('');
        setModal(false);
      }} onClick={() => setModal(false)} okLabel={"select"}>
        <div style={{ height: '40rem', width: '100%' }}>
          <GoogleMapReact
            bootstrapURLKeys={{ key: 'AIzaSyB2COXmiUjYMi651In_irBIHaKnT17L_X8' }}
            defaultCenter={{
              lat: -6.210786300000009,
              lng: 106.81379770000001,
            }}
            zoom={12}
            onClick={({ x, y, lat, lng, event }) => {
              setLat(lat);
              setLng(lng);
              console.log(lat, lng);
            }}
            onChange={({ center }) => {
              setLat(center.lat);
              setLng(center.lng);
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
        <div className="MapForm">
          <Input label='Latitude' compact inputValue={lat} setInputValue={setLat} />
          <Input label='Longitude' compact inputValue={lng} setInputValue={setLng} />
        </div>
      </Modal>
      <Form
        onSubmit={(data) => {
          selected.id ?
            dispatch(editMerchant(data, history, selected.id))
            :
            dispatch(createMerchant(data, history));
        }}
        loading={loading}
      >
        <h2
          style={{
            color: "gray",
          }}
        >
          Merchant Info
        </h2>
        <SectionSeparator />
        <Input label="Name" inputValue={selected.name} />
        <Input label="Email" inputValue={selected.email} />
        <Input label="Phone" type="phone" inputValue={selected.phone} />
        <Input
          label="Legal"
          type="radio"
          options={[
            { value: "individual", label: "Individu" },
            { value: "company", label: "Perusahaan" },
          ]}
          inputValue={selected.legal}
        />
        <Input
          label="Type"
          name="type"
          type="radio"
          options={[
            { value: "services", label: "Services" },
            { value: "goods", label: "Goods" },
          ]}
          inputValue={selected.type}
        />
        <Input
          label="Category"
          type="select"
          options={categories}
          inputValue={category ? category : selected.category}
          setInputValue={setCategory}
        />
        <Input
          label="Province"
          type="select"
          options={provinces}
          inputValue={province ? province : selected.province}
          setInputValue={setProvince}
        />
        <Input
          label="City"
          type="select"
          options={cities}
          inputValue={city ? city : selected.city}
          setInputValue={setCity}
        />
        <Input
          label="District"
          type="select"
          options={districts}
          inputValue={district ? district : selected.district}
          setInputValue={setDistrict}
        />
        <Input
          label="Status"
          type="radio"
          options={[
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ]}
          inputValue={selected.status}
        />
        <SectionSeparator />
        <h2
          style={{
            color: "gray",
          }}
        >
          PIC Info
        </h2>
        <SectionSeparator />
        <Input label="Name" name="pic_name" inputValue={selected.pic_name} />
        <Input label="Phone" name="pic_phone" inputValue={selected.pic_phone} />
        <Input label="Email" name="pic_mail" inputValue={selected.pic_mail} />
        <Input label="Open Time" name="open_at" type="time"
          inputValue={selected.open_at} />
        <Input label="Close Time" name="closed_at" type="time"
          inputValue={selected.closed_at} />
        <Input label="Description" type="textarea" inputValue={selected.description} />
        <Input
          optional
          label="Building"
          type="select"
          name="in_building"
          options={inBuildings}
          inputValue={inBuilding ? inBuilding : selected.in_building}
          setInputValue={setBuilding}
        />
        {!inBuilding && <><Input label="Select Location" type="button"
          onClick={() => {
            setLat(-6.2107863);
            setLng(106.8137977);
            setModal(true);
          }}
        />
          <Input label="Latitude" name="lat" inputValue={lat ? lat : selected.lat} setInputValue={setLat} />
          <Input label="Longitude" name="long" inputValue={lng ? lng : selected.long} setInputValue={setLng} />
          <Input label="Address" type="textarea" inputValue={selected.address} /></>}
        <SectionSeparator />
        <h2
          style={{
            color: "gray",
          }}
        >
          Account Info
        </h2>
        <SectionSeparator />
        <Input label="Account No" name="account_no" inputValue={selected.account_no} />
        <Input label="Account Name" name="account_name" inputValue={selected.account_name} />
        <Input label="Account Bank" name="account_bank" type="select" options={banks} inputValue={selected.account_bank} />
        <SectionSeparator />
      </Form>
    </Template>
  );
}

export default Component;
