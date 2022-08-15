import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { endpointAdmin, endpointMerchant, endpointResident } from "../../settings";
import { get } from "../slice";

import Template from "./components/TemplateInternet";
import { Form } from "formik";
import { providerSchema } from "./services/schemas";
import Input from "./input";
import SubmitButton from "./components/SubmitButton";
import Button from "../../components/Button";
import { editInternetProvider } from "../slices/internet";

import { RiLightbulbLine, RiCalendarEventLine } from "react-icons/ri"

import { toSentenceCase } from "../../utils";

const internetPayloads = {
  provider_name: "",
  image: "",
  pic_name: "",
  pic_email: "",
  pic_phone: "",
  coverage_area: "",
};

function Component() {

  // const { banks } = useSelector((state) => state.main);
  const { loading, selected } = useSelector((state) => state.internet);

  let dispatch = useDispatch();
  let history = useHistory();

  return (
    <Template
      slice="internet"
      payload={
        selected.id
          ? {
              ...internetPayloads,
              ...selected,
              // building_management_id:
              // selected.building_management_id &&
              // selected.building_management_id.map((el) => ({
              //   value: el.id,
              //   label: el.name,
              // })),
            }
          : internetPayloads
      }
      schema={providerSchema}
      formatValues={(values) => ({
        
        ...values,
      })}
      edit={(data) => {
        delete data["deleted"];
        delete data["created_on"];
        dispatch(editInternetProvider(data, history, selected.id))
      }}
      renderChild={(props) => {
        const { setFieldValue, values, errors } = props;
        return (
          <Form className="Form">
            <Input
              {...props}
              label="Provider Name"
              name="provider_name"
              autoComplete="off"
            />
            <Input
              {...props}
              type="file"
              label="Logo Provider"
              name="image"
              autoComplete="off"
              hint="Logo berwarna dengan ukuran 256 x 256 px"
            />
            <Input
              {...props}
              label="PIC Name"
              name="pic_name"
              autoComplete="off"
            />
            <Input
              {...props}
              label="Coverage Area"
              name="coverage_area"
              autoComplete="off"
              hint="Ex: Jakarta, Bandung, Sulawesi, dst"
            />
            <Input
              {...props}
              label="Email"
              name="pic_email"
              autoComplete="off"
            />
            <Input
              {...props}
              label="Phone"
              name="pic_phone"
              prefix="+62"
              autoComplete="off"
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) {
                event.preventDefault();
                }
              }}
            />
            <div className="card" style={{ padding: 15, borderRadius: 10, background: "#F0F6FF"}}>
              <p style={{ color: "#244091" }}><RiLightbulbLine /> Pastikan semua form terisi dengan benar. Silakan cek kembali terlebih dahulu semua data yang telah <br />
              diisi sebelum melakukan submit.</p>
            </div>
            <div>
            <SubmitButton loading={loading} errors={errors} />
            <button style={{
                marginTop: 16,
                marginLeft: 10,
                background: "#F4F4F4",
                color: "#000000",
                paddingTop: 6,
                paddingBottom: 6,
                paddingLeft: 21,
                paddingRight: 21,
            }} 
            onClick={() => history.goBack()}><b>Cancel</b></button>
            </div>
          </Form>
        );
      }}
    />
  );
}


export default Component;
