import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { endpointAdmin, endpointMerchant, endpointResident } from "../../settings";
import { get } from "../slice";

import Template from "./components/TemplateWithFormik";
import { Form } from "formik";
import { internetPackageSchema } from "./services/schemas";
import Input from "./input";
import SubmitButton from "./components/SubmitButton";
import Button from "../../components/Button";

import { RiLightbulbLine, RiCalendarEventLine } from "react-icons/ri"
import { createInternetPackage } from "../slices/internet";

import { toSentenceCase } from "../../utils";
import countries from "../../countries";

const internetPackagePayload = {
  provider_id: "",
  package_name: "",
  speed: "",
  price: "",
  notes: "",
  tv_channel: ""
};

function Component() {

  // const { banks } = useSelector((state) => state.main);
  const { loading, selected } = useSelector((state) => state.internet);

  const [bManagements, setBManagements] = useState([]);
  const [dataBanks, setDataBanks] = useState([]);
  
  const [merchant, setMerchant] = useState([]);
  
  const [inBuildings, setBuildings] = useState([]);
  const [categories, setCategories] = useState([]);

  let dispatch = useDispatch();
  let history = useHistory();
  let { id } = useParams();

  return (
    <Template
      slice="internet"
      payload={
        selected.id
          ? {
              ...internetPackagePayload,
              ...selected,
              // building_management_id:
              // selected.building_management_id &&
              // selected.building_management_id.map((el) => ({
              //   value: el.id,
              //   label: el.name,
              // })),
              // start_date: selected.start_date?.split('T')[0],
              // end_date: selected.end_date?.split('T')[0],
            }
          : internetPackagePayload
      }
      schema={internetPackageSchema}
      formatValues={(values) => ({
        
        ...values,
        provider_id: parseInt(id),
        price: parseInt(values.price),
        // fee: parseInt(values.fee),
        // fee_type: values.fee_type,
        // percentage: parseFloat(values.percentage),
        // markup: 0,
        // start_date: values.start_date,
        // end_date: values.end_date,
        // building_management_id: values.building_management_id,
        // account_bank: values.account_bank,
      })}
      // edit={(data) => {
      //   delete data[undefined];
      //   delete data["fee_type_label"];
      //   dispatch(editVA(data, history, selected.id))
      // }}
      add={(data) => {
        delete data[undefined];
        dispatch(createInternetPackage(data, history))
      }}
      renderChild={(props) => {
        const { setFieldValue, values, errors } = props;
        return (
          <Form className="Form">
            <Input
              {...props}
              label="Package Name"
              name="package_name"
              autoComplete="off"
            />
            <Input
              {...props}
              label="Speed"
              name="speed"
              autoComplete="off"
            />
            <Input
              {...props}
              label="Price"
              name="price"
              autoComplete="off"
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) {
                event.preventDefault();
                }
            }} 
            />
            <Input
              {...props}
              type="textarea"
              label="Notes"
              name="notes"
              autoComplete="off"
            />
            <Input
              {...props}
              type="textarea"
              label="TV Channel"
              name="tv_channel"
              autoComplete="off"
            />
            <div className="card" style={{ padding: 15, borderRadius: 10, background: "#F0F6FF"}}>
              <p style={{ color: "#244091" }}><RiLightbulbLine /> Pastikan semua form terisi dengan benar. Silakan cek kembali terlebih dahulu semua data yang telah <br />
              diisi sebelum melakukan submit.</p>
            </div>
            <div>
            <button style={{
                marginTop: 16,
                marginRight: 10,
                background: "#F4F4F4",
                color: "#000000",
                paddingTop: 6,
                paddingBottom: 6,
                paddingLeft: 21,
                paddingRight: 21,
            }} 
            onClick={() => history.goBack()}><b>Cancel</b></button>
            <SubmitButton loading={loading} errors={errors} />
            </div>
          </Form>
        );
      }}
    />
  );
}


export default Component;
