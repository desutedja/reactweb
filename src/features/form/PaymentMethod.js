import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { endpointAdmin, endpointMerchant } from "../../settings";
import { get } from "../slice";

import Template from "./components/TemplateWithFormik";
import { Form } from "formik";
import { voucherSchema } from "./services/schemas";
import Input from "./input";
import SubmitButton from "./components/SubmitButton";
import { createVoucher, editVoucher } from "../slices/vouchers";

import { RiLightbulbLine, RiCalendarEventLine } from "react-icons/ri"

const voucherPayload = {
  prefix: "",
};

function Component() {

  const { banks } = useSelector((state) => state.main);
  const { loading, selected } = useSelector((state) => state.vouchers);

  const [bManagements, setBManagements] = useState([]);
  
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
      get(endpointMerchant + "/admin/categories", (res) => {
        let formatted = res.data.data.map((el) => ({
          id: el.id,
          label: el.name,
          value: el.name,
        }));
        setCategories(formatted);
      })
    );

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
              expired_date: voucherPayload.expired_date.split("T")[0],
            }
          : voucherPayload
      }
      schema={voucherSchema}
      formatValues={(values) => ({
        
        ...values,
        limit: parseInt(values.limit),
        discount: parseFloat(values.discount),
        minimum_transaction: parseFloat(values.minimum_transaction),
        maximum_discount: parseFloat(values.maximum_discount),
        expired_date: values.expired_date + " 23:59:59",
      })}
      edit={(data) => dispatch(editVoucher(data, history, selected.id))}
      add={(data) => dispatch(createVoucher(data, history))}
      renderChild={(props) => {
        const { setFieldValue, values, errors } = props;
        return (
          <Form className="Form">
            <Input
              {...props}
              label="Bank"
              name="account_bank"
              autoComplete="off"
              placeholder="Pilih Bank"
              options={banks}
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
            <Input {...props} label="Fee" name="fee" autoComplete="off" suffix="Rp" />
            <Input {...props} label="Percentage" name="percentage" autoComplete="off" suffix="%" />
            <Input {...props} label="Markup" name="markup" autoComplete="off" suffix="%" />
            <div class="Input" style={{ marginBottom: 0 }}>
              <label class="Input-label">Period</label>
            </div>
            <Input {...props} label="Start Date" name="startdate" type="date" autoComplete="off" suffix={<RiCalendarEventLine />} />
            <Input {...props} label="End Date" name="enddate" type="date" autoComplete="off" suffix={<RiCalendarEventLine />} />
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
