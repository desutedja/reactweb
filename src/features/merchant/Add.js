import React, { useState, useEffect, Profiler } from "react";

import Input from "../../components/Input";
import Form from "../../components/Form";
import SectionSeparator from "../../components/SectionSeparator";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { post, get } from "../../utils";
import {
  endpointResident,
  endpointAdmin,
  endpointMerchant,
} from "../../settings";
import { createMerchant } from "./slice";
function Component() {
  const headers = useSelector((state) => state.auth.headers);
  const { loading, selected } = useSelector((state) => state.merchant);
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

  const [bcity, setBCity] = useState("");
  const [bcities, setBCities] = useState([]);
  const [bcitiesSearched, setBCitiesSearched] = useState([]);
  const [bcloading, setBCLoading] = useState(true);

  const ColoredLine = ({ color }) => (
    <hr
      style={{
        color: color,
        backgroundColor: color,
        height: 0.2,
        width: "100%",
        alignSelf: "left",
      }}
    />
  );

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
      <Form
        onSubmit={(data) => {
          console.log(data);
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
        <ColoredLine color="black"></ColoredLine>
        <SectionSeparator />
        <Input label="Name" />
        <Input label="Phone" type="phone" />

        <Input
          label="Legal"
          name="legal"
          type="select"
          options={[
            { value: "individual", label: "Individu" },
            { value: "company", label: "Perusahaan" },
          ]}
          inputValue={selected.individual}
        />
        <Input
          label="Type"
          name="type"
          type="select"
          options={[
            { value: "services", label: "Service" },
            { value: "goods", label: "Goods" },
          ]}
          inputValue={selected.individual}
        />
        <Input
          label="Category"
          name="category"
          type="select"
          options={categories}
          inputValue={category ? category : selected.category}
          inputValue={setCategory}
        />
        <Input
          label="Province"
          type="select"
          name="province"
          options={provinces}
          inputValue={province ? province : selected.province}
          setInputValue={setProvince}
        />
        <Input
          label="City"
          type="select"
          name="city"
          options={cities}
          inputValue={city ? city : selected.city}
          setInputValue={setCity}
        />
        <Input
          label="District"
          type="select"
          name="district"
          options={districts}
          inputValue={district ? district : selected.district}
          setInputValue={setDistrict}
        />
        <Input
          label="Building"
          type="select"
          name="in_building"
          options={inBuildings}
          inputValue={inBuilding ? inBuilding : selected.inBuilding}
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
        <ColoredLine color="black"></ColoredLine>
        <SectionSeparator />
        <Input label="Name" name="pic_name" />
        <Input label="Open Time" type="time" /> {/* still not used */}
        <Input label="Phone" name="pic_phone" />
        <Input label="Close Time" type="time" /> {/* still not used */}
        <Input label="Description" name="description" type="textarea" />
        <Input label="Address" name="address" type="textarea" />
        <SectionSeparator />
        <h2
          style={{
            color: "gray",
          }}
        >
          Account Info
        </h2>
        <ColoredLine color="black"></ColoredLine>
        <SectionSeparator />
        <Input label="Account No" name="account_no" />
        <Input label="Account Name" name="account_name" />
        <Input label="Account Bank" name="account_bank" />
        <SectionSeparator />
      </Form>
    </div>
  );
}

export default Component;
