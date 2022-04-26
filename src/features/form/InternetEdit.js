import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { endpointAdmin, endpointMerchant, endpointResident } from "../../settings";
import { get } from "../slice";

import Template from "./components/TemplateWithFormik";
import { Form } from "formik";
import { promoVaSchema } from "./services/schemas";
import Input from "./input";
import SubmitButton from "./components/SubmitButton";
import Button from "../../components/Button";
import { createVoucher, editVoucher } from "../slices/vouchers";

import { RiLightbulbLine, RiCalendarEventLine } from "react-icons/ri"
import { createVA, editVA } from "../slices/promova";

import { toSentenceCase } from "../../utils";

const internetPayload = {
  provider_name: "",
  image: "",
  pic_name: "",
  pic_email: "",
  pic_phone: "",
  coverage_area: "",
};

function Component() {

  // const { banks } = useSelector((state) => state.main);
  const { loading, selected } = useSelector((state) => state.vouchers);

  const [bManagements, setBManagements] = useState([]);
  const [dataBanks, setDataBanks] = useState([]);
  
  const [merchant, setMerchant] = useState([]);
  
  const [inBuildings, setBuildings] = useState([]);
  const [categories, setCategories] = useState([]);

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
      get(
        endpointAdmin +
          "/management/building" +
          "?limit=10&page=1" +
          "&search=",
        (res) => {
          let data = res.data.data.items;

          let formatted = data.map((el) => ({
            label: el.building_name + " by " + el.management_name,
            value: el.id,
          }));

          setBManagements(formatted);
        }
      )
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      get(endpointAdmin + "/paymentperbuilding/list/payment_method", (res) => {
        const banks = res.data.data.items.map((el) => ({
          value: el.id,
          label: toSentenceCase(el.provider),
        }));

        // console.log(banks)

        dispatch(setDataBanks(banks));
      })
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      get(
        endpointMerchant +
          "/admin/listmerchantname?search=",
        (res) => {
          
          let formatted = res.data.data.map((el) => {
            return {
              id: el.id,
              label: el.name,
              value: el.name,
            };
          });
          setMerchant(formatted);
        }
      )
    );
  }, [dispatch]);

  return (
    <Template
      slice="vouchers"
      payload={
        selected.id
          ? {
              ...internetPayload,
              ...selected,
              // building_management_id:
              // selected.building_management_id &&
              // selected.building_management_id.map((el) => ({
              //   value: el.id,
              //   label: el.name,
              // })),
            }
          : internetPayload
      }
      // schema={promoVaSchema}
      formatValues={(values) => ({
        
        ...values,
        // building_management_id: values.building_management_id,
        // account_bank: values.account_bank,
      })}
      edit={(data) => {
        delete data[undefined];
        delete data["fee_type_label"];
        // dispatch(editVA(data, history, selected.id))
      }}
      add={(data) => {
        delete data[undefined];
        // dispatch(createProvider(data, history))
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
