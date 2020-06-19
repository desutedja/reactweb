import React, { useState, useEffect } from "react";

import Input from "../../components/Input";
import Form from "../../components/Form";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import SectionSeparator from "../../components/SectionSeparator";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { get } from "../../utils";
import {
  endpointResident,
  endpointAdmin,
  endpointMerchant,
  banks,
} from "../../settings";
import { createMerchant, editMerchant } from "./slice";
import GoogleMapReact from "google-map-react";
import { FiMapPin } from "react-icons/fi";
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

  const [inBuilding, setBuilding] = useState("");
  const [inBuildings, setBuildings] = useState([]);

  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);

  const headers = useSelector((state) => state.auth.headers);
  const { loading, selected } = useSelector((state) => state.merchant);

  let dispatch = useDispatch();
  let history = useHistory();

  useEffect(() => {
    setBuilding("");
    get(endpointAdmin + "/building?page=1&limit=9999", headers, (res) => {
      let formatted = res.data.data.items.map((el) => ({
        label: el.name,
        value: el.id,
      }));
      setBuildings(formatted);
    });
  }, [headers]);

  useEffect(() => {
    setCategory("");
    get(endpointMerchant + "/admin/categories", headers, (res) => {
      let formatted = res.data.data.map((el) => ({
        label: el.name,
        value: el.name,
      }));
      setCategories(formatted);
    });
  }, [headers]);

  useEffect(() => {
    get(endpointResident + "/geo/province", headers, (res) => {
      let formatted = res.data.data.map((el) => ({
        label: el.name,
        value: el.id,
      }));
      setProvinces(formatted);
    });
  }, [headers]);

  useEffect(() => {
    setCity("");
    (province || selected.province) &&
      get(
        endpointResident +
        "/geo/province/" +
        (province ? province : selected.province),
        headers,
        (res) => {
          let formatted = res.data.data.map((el) => ({
            label: el.name,
            value: el.id,
          }));
          setCities(formatted);
        }
      );
  }, [headers, province, selected.province]);

  useEffect(() => {
    setDistrict("");
    (city || selected.city) &&
      get(
        endpointResident + "/geo/city/" + (city ? city : selected.city),
        headers,
        (res) => {
          let formatted = res.data.data.map((el) => ({
            label: el.name,
            value: el.id,
          }));
          setDistricts(formatted);
        }
      );
  }, [headers, city, selected.city]);

  return (
    <div>
      <Modal isOpen={modal} toggle={() => {
                setLat('');
                setLng('');
                setModal(false);
            }}>
                <div style={{ height: '20rem', width: '60rem' }}>
                    <GoogleMapReact
                        bootstrapURLKeys={{ key: 'AIzaSyB2COXmiUjYMi651In_irBIHaKnT17L_X8' }}
                        center={{
                            lat: lat,
                            lng: lng,
                        }}
                        zoom={12}
                        onClick={({ x, y, lat, lng, event }) => {
                            setLat(lat);
                            setLng(lng);
                            console.log(lat, lng);
                        }}
                    >
                        <FiMapPin size={40} />
                    </GoogleMapReact>
                </div>
                <div className="MapForm">
                    <Input label='Latitude' compact inputValue={lat} setInputValue={setLat} />
                    <Input label='Longitude' compact inputValue={lng} setInputValue={setLng} />
                </div>
                <Button label='Select' onClick={() => setModal(false)} />
            </Modal>
      <Form
        onSubmit={(data) => {
          selected.id ?
            dispatch(editMerchant(headers, data, history, selected.id))
            :
            dispatch(createMerchant(headers, data, history));
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
          type="select"
          options={[
            { value: "individual", label: "Individu" },
            { value: "company", label: "Perusahaan" },
          ]}
          inputValue={selected.legal}
        />
        <Input
          label="Type"
          name="type"
          type="select"
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
          label="Building"
          type="select"
          name="in_building"
          options={inBuildings}
          inputValue={inBuilding ? inBuilding : selected.in_building}
          setInputValue={setBuilding}
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
        <Input label="Select Location" type="button"
                    onClick={() => {
                        setLat(-6.2107863);
                        setLng(106.8137977);
                        setModal(true);
                    }}
                />
                <Input label="Latitude" name="lat" inputValue={lat ? lat : selected.lat} setInputValue={setLat} />
                <Input label="Longitude" name="long" inputValue={lng ? lng : selected.long} setInputValue={setLng} />
        <Input label="Address" type="textarea" inputValue={selected.address} />
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
        <Input label="Account Bank" name="account_bank"  type="select" options={banks} inputValue={selected.account_bank} />
        <SectionSeparator />
      </Form>
    </div>
  );
}

export default Component;
