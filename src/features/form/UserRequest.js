import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { endpointAdmin, endpointMerchant, endpointResident } from "../../settings";
import { get } from "../slice";

import Template from "./components/TemplateInternet";
import { Form } from "formik";
import { providerSchema, userRequestSchema } from "./services/schemas";
import Input from "./input";
import SubmitButton from "./components/SubmitButton";
import Button from "../../components/Button";

import { RiLightbulbLine, RiCalendarEventLine } from "react-icons/ri"
import { createInternetProvider} from "../slices/internet";

import { toSentenceCase } from "../../utils";
import { createUserRequest } from "../slices/userRequest";

const userRequestPayload = {
  category: "",
  sub_category: parseInt(""),
  title: "",
  description: "",
  status: "",
  attachments: [],
};

const listCate = [
  {label:"Billing", value:1},
  {label:"Account", value:2},
  {label:"Others", value:3},
];

const subBilling = [
  {label:"Paid/Unpaid", value:1},
  {label:"Hilangkan Denda", value:2},
  {label:"Hapus Billing Item", value:3},
];

const subAccount = [
  {label:"Tidak menerima OTP", value:4},
  {label:"Tidak bisa Upgrade Permium User", value:5},
];

function Component() {

  // const { banks } = useSelector((state) => state.main);
  const { loading, selected } = useSelector((state) => state.userRequest);

  const [bManagements, setBManagements] = useState([]);
  const [dataBanks, setDataBanks] = useState([]);
  
  const [merchant, setMerchant] = useState([]);
  
  const [inBuildings, setBuildings] = useState([]);
  const [categories, setCategories] = useState([]);

  let dispatch = useDispatch();
  let history = useHistory();

  return (
    <Template
      slice="userRequest"
      payload={
        selected.id
          ? {
              ...userRequestPayload,
              ...selected,
              // building_management_id:
              // selected.building_management_id &&
              // selected.building_management_id.map((el) => ({
              //   value: el.id,
              //   label: el.name,
              // })),
              status: selected.category === 1 ? "wfa" : "wfp", 
            }
          : userRequestPayload
      }
      // schema={userRequestSchema}
      formatValues={(values) => ({
        
        ...values,
        status: values.category === 1 ? "wfa" : "wfp",
        attachments: [values.attachments],
      })}
      add={(data) => {
        delete data[undefined];
        delete data['category_label'];
        delete data['sub_category_label'];
        dispatch(createUserRequest(data, history))
      }}
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
            {values.category === 1 ?
            <Input
              {...props}
              type="select"
              label="Sub Category"
              name="sub_category"
              options={subBilling}
              placeholder="Select Sub Category"
              autoComplete="off"
            />
            :
            values.category === 2 ?
            <Input
              {...props}
              type="select"
              label="Sub Category"
              name="sub_category"
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
              type="editor"
              name="description"
            />
            <Input
              {...props}
              type="files"
              label="Attachment"
              name="attachments"
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
                color: "#3E414C",
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
