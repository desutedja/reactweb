import React, { useState, useEffect } from "react";
import { FiMapPin } from "react-icons/fi";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { GoogleMap } from "@react-google-maps/api";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

import Modal from "../../components/Modal";
import SectionSeparator from "../../components/SectionSeparator";
import {
  endpointAdmin,
  endpointMerchant,
  endpointResident,
} from "../../settings";
import { createMerchant, editMerchant } from "../slices/merchant";
import { get } from "../slice";

import Template from "./components/TemplateWithFormik";
import { Form } from "formik";
import { merchantSchema } from "./services/schemas";
import Input from "./input";
import SubmitButton from "./components/SubmitButton";

const merchantPayload = {
  name: "",
  type: "goods",
  legal: "individual",
  category: "",
  phone: "",
  status: "inactive",
  description: "",
  in_buildings: [],
  address: "",
  province: "",
  city: "",
  district: "",
  lat: "",
  long: "",
  pic_name: "",
  pic_phone: "",
  pic_mail: "",
  account_bank: "",
  account_no: "",
  account_name: "",
  free_deliv: "0",
  free_deliv_min: 0,
  courier_fee: 0,

  category_label: "",
  in_building_label: "None",
  account_bank_label: "",
  province_label: "",
  city_label: "",
  district_label: "",
};

function Component() {
  const { banks } = useSelector((state) => state.main);
  const { loading, selected } = useSelector((state) => state.merchant);

  const [modal, setModal] = useState(false);

  const [inBuildings, setBuildings] = useState([]);
  const [categories, setCategories] = useState([]);

  const [address, setAddress] = useState("");
  const [freeDeliv, setFreeDeliv] = useState("");
  const [center, setCenter] = useState(
    selected?.lat
      ? {
          lat: selected.lat,
          lng: selected.long,
        }
      : null
  );

  const [districts, setDistricts] = useState([]);

  const [city, setCity] = useState("");
  const [cities, setCities] = useState([]);

  const [province, setProvince] = useState("");
  const [provinces, setProvinces] = useState([]);

  let dispatch = useDispatch();
  let history = useHistory();

  useEffect(() => {
    dispatch(
      get(endpointAdmin + "/building?page=1&limit=9999", (res) => {
        let formatted = res.data.data.items.map((el) => ({
          label: el.name,
          value: el.id,
          lat: el.lat,
          long: el.long,
        }));
        setBuildings(formatted);
      })
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      get(endpointMerchant + "/admin/categories", (res) => {
        let formatted = res.data.data.map((el) => ({
          label: el.name,
          value: el.name,
        }));
        setCategories(formatted);
      })
    );
  }, [dispatch]);

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

  return (
    <Template
      slice="merchant"
      payload={
        selected.id
          ? {
              ...merchantPayload,
              ...selected,
              phone: selected.phone.slice(2),
              pic_phone: selected.pic_phone.slice(2),
              in_buildings:
                selected.building_list &&
                selected.building_list.map((el) => ({
                  value: el.id,
                  label: el.name,
                })),
            }
          : merchantPayload
      }
      schema={merchantSchema}
      formatValues={(values) => ({
        ...values,
        phone: "62" + values.phone,
        pic_phone: "62" + values.pic_phone,
        in_buildings: values.in_buildings.map((b) => b.value),
        lat: parseFloat(values.lat),
        long: parseFloat(values.long),
        free_deliv: parseInt(values.free_deliv),
        free_deliv_min: parseInt(values.free_deliv_min),
        courier_fee: parseInt(values.courier_fee),
      })}
      edit={(data) => dispatch(editMerchant(data, history, selected.id))}
      add={(data) => dispatch(createMerchant(data, history))}
      renderChild={(props) => {
        const { setFieldValue, values, errors } = props;
        console.log("values: ", values);
        return (
          <Form className="Form">
            <Modal
              isOpen={modal}
              toggle={() => {
                setModal(false);
              }}
              onClick={() => setModal(false)}
              okLabel={"Select"}
            >
              <PlacesAutocomplete
                value={address}
                onChange={(value) => setAddress(value)}
                onSelect={(value) => {
                  setAddress(value);
                  geocodeByAddress(value)
                    .then((results) => getLatLng(results[0]))
                    .then((latLng) => setCenter(latLng))
                    .catch((error) => console.error("Error", error));
                }}
              >
                {({
                  getInputProps,
                  suggestions,
                  getSuggestionItemProps,
                  loading,
                }) => (
                  <div
                    className="mb-3"
                    style={{
                      position: "relative",
                    }}
                  >
                    <input
                      {...getInputProps({
                        placeholder: "Search Places ...",
                        className: "w-100",
                      })}
                    />
                    <div
                      className="autocomplete-dropdown-container w-100"
                      style={{
                        position: "absolute",
                        top: "100%",
                        zIndex: "1",
                        borderRadius: "4px",
                        overflow: "auto",
                      }}
                    >
                      {loading && (
                        <div
                          className="p-3"
                          style={{ backgroundColor: "white" }}
                        >
                          Loading...
                        </div>
                      )}
                      {suggestions.map((suggestion) => {
                        const className =
                          (suggestion.active
                            ? "suggestion-item--active"
                            : "suggestion-item") + " p-3";
                        // inline style for demonstration purpose
                        const style = suggestion.active
                          ? {
                              backgroundColor: "#fafafa",
                              cursor: "pointer",
                            }
                          : {
                              backgroundColor: "#ffffff",
                              cursor: "pointer",
                            };
                        return (
                          <div
                            {...getSuggestionItemProps(suggestion, {
                              className,
                              style,
                            })}
                          >
                            <span>{suggestion.description}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </PlacesAutocomplete>
              <div
                style={{ height: "40rem", width: "100%", position: "relative" }}
              >
                <GoogleMap
                  mapContainerStyle={{
                    width: "100%",
                    height: "100%",
                  }}
                  center={
                    center || {
                      lat: -6.2107863,
                      lng: 106.8137977,
                    }
                  }
                  zoom={12}
                  onClick={({ latLng }) => {
                    setCenter({
                      lat: latLng.lat(),
                      lng: latLng.lng(),
                    });
                    setFieldValue("lat", latLng.lat());
                    setFieldValue("long", latLng.lng());
                  }}
                  onUnmount={({ center }) => {
                    setCenter({
                      lat: center.lat(),
                      lng: center.lng(),
                    });
                    setFieldValue("lat", center.lat());
                    setFieldValue("long", center.lng());
                  }}
                  clickableIcons
                ></GoogleMap>
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <FiMapPin size={40} color="dodgerblue" />
                </div>
              </div>
            </Modal>

            <Input {...props} label="Name" />
            <Input {...props} label="Phone" prefix="+62" />
            <Input
              {...props}
              label="Type"
              type="radio"
              options={[
                { value: "goods", label: "Goods" },
                { value: "services", label: "Services" },
              ]}
            />
            <Input
              {...props}
              label="Legal"
              type="radio"
              options={[
                { value: "individual", label: "Individual" },
                { value: "company", label: "Company" },
              ]}
            />
            <Input {...props} label="Category" options={categories} />
            <Input
              {...props}
              label="Status"
              type="radio"
              options={[
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
              ]}
            />
            <Input {...props} label="Description" type="textarea" />

            {values.type === "goods" && (
              <>
                <SectionSeparator />

                <Input
                  {...props}
                  label="Next Day Delivery"
                  type="radio"
                  name="free_deliv"
                  options={[
                    { value: "1", label: "Yes" },
                    { value: "0", label: "No" },
                  ]}
                  onChange={(el) => {
                    if (parseInt(el) === 0) {
                      setFieldValue("free_deliv_min", 0);
                      setFieldValue("courier_fee", 0);
                    }
                  }}
                />

                {parseInt(values.free_deliv) === 1 && (
                  <Input
                    {...props}
                    label="Free Delivery Min"
                    name="free_deliv_min"
                  />
                )}
                {parseInt(values.free_deliv) === 1 && (
                  <Input {...props} label="Courier Fee" name="courier_fee" />
                )}
              </>
            )}
            <SectionSeparator />

            <Input
              {...props}
              optional
              label="Building"
              name="in_buildings"
              type="multiselect"
              placeholder="Select building(s)"
              options={inBuildings}
              defaultValue={values.in_buildings}
              onChange={(el) => {
                console.log(el);
              }}
            />
            <button type="button" onClick={() => setModal(true)}>
              Select Location
            </button>
            <Input {...props} label="Latitude" name="lat" />
            <Input {...props} label="Longitude" name="long" />
            <Input {...props} label="Address" type="textarea" />
            <Input
              {...props}
              label="Province"
              options={provinces}
              onChange={(el) => setProvince(el.value)}
            />
            {values.province && (
              <Input
                {...props}
                label="City"
                options={cities}
                onChange={(el) => setCity(el.value)}
              />
            )}
            {values.city && (
              <Input {...props} label="District" options={districts} />
            )}

            <SectionSeparator />

            <Input {...props} label="PIC Name" />
            <Input {...props} label="PIC Phone" prefix="+62" />
            <Input {...props} label="PIC Mail" />

            <SectionSeparator />

            <Input
              {...props}
              label="Bank Account"
              name="account_bank"
              options={banks}
            />
            <Input {...props} label="Bank Account Number" name="account_no" />
            <Input {...props} label="Bank Account Name" name="account_name" />
            <SubmitButton loading={loading} errors={errors} />
          </Form>
        );
      }}
    />
  );
}

export default Component;
