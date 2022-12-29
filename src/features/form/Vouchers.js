import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { endpointAdmin, endpointMerchant } from "../../settings";
import { get } from "../slice";

import Template from "./components/TemplateWithFormik";
import { Form } from "formik";
import { voucherSchemaV2 } from "./services/schemas";
import Input from "./inputVoucher";
import SubmitButton from "./components/SubmitButton";
import {
  createVoucher,
  createVoucherV2,
  editVoucher,
} from "../slices/vouchers";
import SectionSeparator from "../../components/SectionSeparator";
import moment from "moment";

const today = moment().format("YYYY-MM-DD");

const voucherPayload = {
  remark: "",
  start_date: today,
  expired_date: today,
};

function Component() {
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
          building_name: el.name,
          id: el.id,
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
      get(endpointMerchant + "/admin/listmerchantname?search=", (res) => {
        let formatted = res.data.data.map((el) => {
          return {
            id: el.id,
            merchant_name: el.name,
          };
        });
        setMerchant(formatted);
      })
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
      schema={voucherSchemaV2}
      formatValues={(values) => ({
        ...values,
        voucher_code: values.type === "special" ? values.voucher_code : "",
        discount: parseFloat(values.discount),
        minimum_transaction: parseFloat(values.minimum_transaction),
        maximum_discount:
          values.discount_type === "percentage"
            ? parseFloat(values.maximum_discount)
            : 0,
        max_voucher_peruser: parseInt(values.max_voucher_peruser),
        total_voucher: parseInt(values.total_voucher),
        start_date: values.start_date + " 00:00:00",
        expired_date: values.expired_date + " 23:59:59",
      })}
      add={(data) => {
        delete data[undefined];
        delete data["discount_type_label"];
        delete data["target_building_label"];
        delete data["Premium User"];
        dispatch(createVoucherV2(data, history));
      }}
      renderChild={(props) => {
        const { setFieldValue, values, errors } = props;
        return (
          <Form className="Form">
            <div class="Input" style={{ marginBottom: 20, fontSize: 16 }}>
              <label class="Input-label">Voucher Information</label>
            </div>
            <Input
              {...props}
              type="radioVoucher"
              label="Category Voucher"
              name="category"
              options={[
                {
                  value: "billing",
                  label: "Tagihan",
                  desc: (
                    <>
                      Voucher hanya bisa digunakan untuk transaksi{" "}
                      <b>Bayar Tagihan</b>
                    </>
                  ),
                },
                {
                  value: "merchant",
                  label: "Merchant",
                  desc: (
                    <>
                      Voucher hanya bisa digunakan untuk transaksi{" "}
                      <b>Menu Shop</b>
                    </>
                  ),
                },
              ]}
            />
            <Input
              {...props}
              type="radioVoucher"
              label="Target Voucher"
              name="type"
              options={[
                {
                  value: "public",
                  label: "Publik",
                  desc: (
                    <>
                      Kupon akan ditampilkan dan dapat langsung digunakan semua
                      user untuk bertransaksi.
                    </>
                  ),
                },
                {
                  value: "special",
                  label: "Khusus",
                  desc: (
                    <>
                      Kode promo hanya dapat digunakan oleh user yang menerima
                      kode khusus.
                    </>
                  ),
                },
              ]}
            />
            <Input
              {...props}
              label="Voucher Name"
              name="voucher_name"
              hint="Nama voucher akan menjadi judul utama yang dilihat oleh pembeli di tokomu."
              placeholder="Contoh: Diskon 10% Bayar Tagihan"
            />
            {values.type === "special" ? (
              <Input
                {...props}
                label="Voucher Code"
                name="voucher_code"
                hint="Kode harus unik dan tidak sama dengan voucher aktif yang lain saat ini."
                placeholder="Contoh: DISKON10"
              />
            ) : (
              []
            )}
            {values.category === "billing" ? (
              <Input
                {...props}
                type="multiselectbuilding"
                label="Target Building"
                name="target_buildings"
                autoComplete="off"
                placeholder="Start typing to add Building"
                options={[...inBuildings]}
              />
            ) : (
              []
            )}
            {values.category === "merchant" ? (
              <Input
                {...props}
                type="multiselectmerchant"
                label="Target Merchant"
                name="target_merchants"
                autoComplete="off"
                placeholder="Start typing to add Merchant"
                options={[...merchant]}
              />
            ) : (
              []
            )}
            <Input
              {...props}
              type="select"
              label="Target User"
              name="target_user"
              autoComplete="off"
              placeholder="Select Target User"
              options={[
                { value: "all", label: "All User" },
                { value: "premium", label: "Premium User" },
                { value: "basic", label: "Basic User" },
              ]}
            />

            <SectionSeparator />

            <div class="Input" style={{ marginBottom: 20, fontSize: 16 }}>
              <label class="Input-label">Voucher Settings</label>
            </div>
            <Input
              {...props}
              type="radio"
              label="Discount Type"
              name="discount_type"
              options={[
                { value: "fee", label: "Nominal" },
                { value: "percentage", label: "Persentase" },
              ]}
            />
            {values.discount_type === "fee" ? (
              <Input
                {...props}
                prefix="Rp."
                name="discount"
                label="Nominal Discount"
                hint="Nominal diskon tidak boleh kosong."
                placeholder="10000"
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
              />
            ) : values.discount_type === "percentage" ? (
              <>
                <Input
                  {...props}
                  suffix="%"
                  name="discount"
                  label="Persentase Discount"
                  hint="Persentase diskon tidak boleh kosong."
                  placeholder="1-100"
                  maxLength={5}
                  onKeyPress={(event) => {
                    if (!/^\d*(?:[.]\d*)?$/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                />
                <Input
                  {...props}
                  prefix="Rp."
                  name="maximum_discount"
                  label="Maksimum Discount"
                  hint="Maksimum diskon tidak boleh kosong."
                  placeholder="10000"
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                />
              </>
            ) : (
              []
            )}
            <Input
              {...props}
              prefix="Rp."
              name="minimum_transaction"
              label="Minimum Transaction"
              hint="Harus lebih tinggi dari nominal diskon."
              placeholder="10000"
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
            />
            <Input
              {...props}
              name="total_voucher"
              label="Total Voucher"
              placeholder="10"
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
            />
            <Input
              {...props}
              name="max_voucher_peruser"
              label="Maximum Use of Vouchers by User"
              placeholder="10"
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
            />
            <Input
              {...props}
              type="date"
              name="start_date"
              label="Start Date"
            />
            <Input
              {...props}
              type="date"
              name="expired_date"
              label="Expired Date"
            />
            <Input
              {...props}
              label="Syarat & Ketentuan Voucher"
              type="editor"
              name="remark"
            />

            <SubmitButton loading={loading} errors={errors} />
          </Form>
        );
      }}
    />
  );
}

export default Component;
