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

const voucherPayload = {
  prefix: "",
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
      edit={(data) =>{
        delete data[undefined];
        dispatch(editVoucher(data, history, selected.id))}}
      add={(data) =>{
        delete data[undefined];
        delete data["discount_type_label"];
        dispatch(createVoucher(data, history))
      }}
      renderChild={(props) => {
        const { setFieldValue, values, errors } = props;
        return (
          <Form className="Form">
            <Input {...props} label="Promo Code" name="prefix" />
            <Input
              {...props}
              label="Building Management"
              name="building_management_id"
              autoComplete="off"
              options={bManagements}
            />
            <Input
              {...props}
              type="multiselect"
              label="Select Merchant(s)"
              name="merchant_id"
              autoComplete="off"
              placeholder="Start typing to add Merchant"
              options={[...merchant]}
            />
            <Input {...props} label="Total Voucher" name="limit" />
            <Input
              {...props}
              label="Discount Type"
              name="discount_type"
              autoComplete="off"
              options={[
                { value: "percentage", label: "Percentage" },
                { value: "value", label: "Value" },
              ]}
            />
            <Input {...props} label="Discount" name="discount" autoComplete="off" />
            <Input {...props} label="Minimum Transaction" name="minimum_transaction" autoComplete="off" />
            <Input {...props} label="Maximum Discount" name="maximum_discount" autoComplete="off" />
            <Input
              {...props}
              label="Expired Date"
              name="expired_date"
              type="date"
            />
            {categories.length > 0 && (
              <CategoriesTable
                options={[...categories]}
                values={values.categories}
                setMaximum={(value) => setFieldValue("usage_limit", value)}
                setFieldValue={(value) => setFieldValue("categories", value)}
              />
            )}
            <SubmitButton loading={loading} errors={errors} />
          </Form>
        );
      }}
    />
  );
}

const CategoriesTable = ({ options, setFieldValue, values, setMaximum }) => {
  const [categoryList, setCategoryList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [maximumLimit, setMaximumLimit] = useState(0);

  useEffect(() => {
    setCategoryList([...options]);
  }, [options]);

  useEffect(() => {
    setFieldValue([...categories]);
  }, [categories]);

  useEffect(() => {}, [maximumLimit]);

  const handleChange = (category_id, limit) => {
    const cats = categories;
    let max = 0;
    if (limit === 0 || isNaN(limit)) {
      const cateFilter = cats.filter((i) => i.category_id !== category_id);
      max = cateFilter.reduce((a, b) => a + (b.limit || 0), 0);
      setMaximumLimit(max);
      setMaximum(max);
      setCategories([...cateFilter]);
      setFieldValue([...cats]);
      return;
    }

    let categoryIndex = cats.findIndex((x) => x.category_id === category_id);
    const data = {
      category_id,
      limit,
    };
    if (categoryIndex < 0) {
      cats.push(data);
    } else {
      cats[categoryIndex] = data;
    }

    max = cats.reduce((a, b) => a + (b.limit || 0), 0);

    setCategories([...cats]);
    setFieldValue([...cats]);
    setMaximumLimit(max);
    setMaximum(max);
  };
  return (
    <>
      <div class="Input" style={{ marginBottom: 0 }}>
        <label class="Input-label">Categories</label>
      </div>
      <div class="css-table">
        <div class="css-table-header">
          <div style={{ width: "20%", height: 50, verticalAlign: "middle" }}>
            Categories
          </div>
          <div
            style={{ width: "10%", verticalAlign: "middle", cursor: "pointer" }}
          >
            Limit
          </div>
        </div>

        <div class="css-table-body">
          {categoryList.length > 0 &&
            categoryList.map((el, index) => {
              return (
                <div key={index} class="css-table-row">
                  <div style={{ textAlign: "left" }}>{el.label}</div>
                  <div>
                    <input
                      type="number"
                      autoComplete="off"
                      onChange={(val) => {
                        handleChange(el.id, parseInt(val.target.value));
                      }}
                      // checked={moduleAccess[index].privilege.read}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default Component;
