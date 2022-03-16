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
import { createVoucher, editVoucher } from "../slices/vouchers";

import { RiLightbulbLine, RiCalendarEventLine } from "react-icons/ri"
import { createVA, editVA } from "../slices/promova";

import { toSentenceCase } from "../../utils";

const voucherPayload = {
  account_bank: "",
  building_management_id: "",
  fee_type: "",
  fee: "",
  percentage: "",
  markup: "",
  start_date: "",
  end_date: ""
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
              ...voucherPayload,
              ...selected,
              // building_management_id:
              // selected.building_management_id &&
              // selected.building_management_id.map((el) => ({
              //   value: el.id,
              //   label: el.name,
              // })),
              start_date: selected.start_date?.split('T')[0],
              end_date: selected.end_date?.split('T')[0],
            }
          : voucherPayload
      }
      // schema={promoVaSchema}
      formatValues={(values) => ({
        
        ...values,
        fee: parseInt(values.fee),
        fee_type: values.fee_type,
        percentage: parseFloat(values.percentage),
        markup: 0,
        start_date: values.start_date,
        end_date: values.end_date,
        // building_management_id: values.building_management_id,
        // account_bank: values.account_bank,
      })}
      edit={(data) => {
        delete data[undefined];
        delete data["fee_type_label"];
        dispatch(editVA(data, history, selected.id))
      }}
      add={(data) => {
        delete data[undefined];
        delete data["fee_type_label"];
        dispatch(createVA(data, history))
      }}
      renderChild={(props) => {
        const { setFieldValue, values, errors } = props;
        return (
          <Form className="Form">
            <Input
              {...props}
              type="multiselect"
              label="Bank"
              name="account_bank"
              autoComplete="off"
              placeholder="Pilih Bank"
              options={dataBanks}
            />
            <Input
              {...props}
              type="multiselect"
              label="Building Management"
              name="building_management_id"
              autoComplete="off"
              placeholder="Start typing to add Building"
              options={bManagements}
            />
            <Input
              {...props}
              label="Fee Type"
              name="fee_type"
              autoComplete="off"
              options={[
                { value: "fee", label: "Fee" },
                { value: "percentage", label: "Percentage" },
                { value: "combination", label: "Combination" },
              ]}
            />
            {values["fee_type"] === "fee" ?
              <>
                <Input {...props} label="Fee" name="fee" autoComplete="off" suffix="Rp" />
              </>
              : values["fee_type"] === "percentage" ?
              <>
                <Input {...props} label="Percentage" name="percentage" autoComplete="off" suffix="%" />
              </>
              : values["fee_type"] === "combination" ?
              <>
                <Input {...props} label="Fee" name="fee" autoComplete="off" suffix="Rp" />
                <Input {...props} label="Percentage" name="percentage" autoComplete="off" suffix="%" />
              </>
              : null
            }
            {/* <Input {...props} label="Markup" name="markup" type="hidden" value="0" autoComplete="off" /> */}
            <div class="Input" style={{ marginBottom: 0 }}>
              <label class="Input-label">Period</label>
            </div>
            <Input {...props} label="Start Date" name="start_date" type="date" suffix={<RiCalendarEventLine />} />
            <Input {...props} label="End Date" name="end_date" type="date" suffix={<RiCalendarEventLine />} />
            <div className="card" style={{ padding: 15, borderRadius: 10, background: "#F0F6FF"}}>
              <p style={{ color: "#244091" }}><RiLightbulbLine /> Pastikan semua form terisi dengan benar. Silakan cek kembali terlebih dahulu semua data yang telah <br />
              diisi sebelum melakukan submit.</p>
            </div>
            <SubmitButton loading={loading} errors={errors} />
          </Form>
        );
      }}
    />
  );
}


export default Component;
