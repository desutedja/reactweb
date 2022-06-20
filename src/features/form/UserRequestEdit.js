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

const listCate = [
  {label:"Billing", value:"billing"},
  {label:"Account", value:"account"},
  {label:"Others", value:"other"},
];

const subBilling = [
  {label:"Settlement", value:"settlement"},
  {label:"Disburshment", value:"disburshment"},
];

const subAccount = [
  {label:"Login Error", value:"login_error"},
  {label:"Data Hilang", value:"data_hilang"},
];

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
      // edit={(data) => {
      //   delete data["deleted"];
      //   delete data["created_on"];
      //   dispatch(editInternetProvider(data, history, selected.id))
      // }}
      renderChild={(props) => {
        const { setFieldValue, values, errors } = props;
        return (
          <Form className="Form">
            <Input
              {...props}
              type="select"
              label="Category"
              name="category"
              options={listCate}
              placeholder="Select Category"
              autoComplete="off"
            />
            {values.category === "billing" ?
            <Input
              {...props}
              type="select"
              label="Sub Category"
              name="sub_category_billing"
              options={subBilling}
              placeholder="Select Sub Category"
              autoComplete="off"
            />
            :
            values.category === "account" ?
            <Input
              {...props}
              type="select"
              label="Sub Category"
              name="sub_category_account"
              options={subAccount}
              placeholder="Select Sub Category"
              autoComplete="off"
            />
            :
            []
            }
            <Input
              {...props}
              label="Title"
              name="title"
              autoComplete="off"
            />
            <Input
              {...props}
              label="Description"
              name="description"
              autoComplete="off"
            />
            <Input
              {...props}
              type="file"
              label="Attachment"
              name="attachment"
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
