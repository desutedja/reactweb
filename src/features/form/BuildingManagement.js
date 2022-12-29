import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import {
  createBuildingManagement,
  editBuildingManagement,
} from "../slices/building";
import { endpointAdmin } from "../../settings";
import { get } from "../slice";

import Template from "./components/TemplateWithFormik";
import Input from "./input";
import { Form } from "formik";
import { buildingSchema } from "./services/schemas";
import SubmitButton from "./components/SubmitButton";
// import { auth } from 'firebase';

const dateArray = (() => {
  const array = Array(31).fill({});

  return array.map((el, index) => ({
    label: index + 1 + "",
    value: index + 1 + "",
  }));
})();

function Component() {
  const { auth } = useSelector((state) => state);
  const { selected, loading } = useSelector((state) => state.building);

  const [managements, setManagements] = useState([]);
  const [datas, setDatas] = useState({});

  let dispatch = useDispatch();
  let history = useHistory();

  const { banks } = useSelector((state) => state.main);
  let { id } = useParams();

  useEffect(() => {
    dispatch(
      get(
        endpointAdmin +
          "/management" +
          "?limit=" +
          9999 +
          "&page=1" +
          "&search=",
        (res) => {
          let data = res.data.data.items;

          let formatted = data.map((el) => ({
            label: el.name,
            value: el.id,
          }));

          setManagements(formatted);
        }
      )
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      get(endpointAdmin + "/building/details/" + id, (res) => {
        setDatas(res.data.data);
        console.log(res.data.data);
        // dispatch(setSelected(res.data.data));
      })
    );
  }, [dispatch, id]);

  const buildingPayload = {
    management_id: "",
    management_name: "",
    in_range: "",
    settlement_bank: "",
    settlement_account_no: "",
    settlement_account_name: "",
    billing_published: "",
    billing_duedate: "",
    penalty_fee: "",
    auto_assign: "",
    auto_assign_limit: "",
    auto_assign_schedule: "",
    auto_assign_schedule_day: "",
    courier_fee: "",
    courier_internal_markup: "",
    courier_external_markup: "",
    xenplatform_active: "",
  };

  return (
    <Template
      slice="building"
      payload={
        selected.id
          ? {
              ...buildingPayload,
              ...selected,
              building_id: parseInt(id),
              building_name: datas.name,
              status: selected.status,
            }
          : buildingPayload
      }
      //   schema={buildingSchema}
      formatValues={(values) => ({
        ...values,
        building_id: parseInt(id),
        building_name: datas.name,
        management_name: values.management_id_label,
        in_range: parseInt(values.in_range),
        billing_published: parseInt(values.billing_published),
        billing_duedate: parseInt(values.billing_duedate),
        penalty_fee: parseInt(values.penalty_fee),
        auto_assign_limit: parseInt(values.auto_assign_limit),
        auto_assign_schedule_day: parseInt(values.auto_assign_schedule_day),
        courier_fee: parseInt(values.courier_fee),
        courier_internal_markup: parseInt(values.courier_internal_markup),
        courier_external_markup: parseInt(values.courier_external_markup),
        status: selected.status ? selected.status : "inactive",
      })}
      edit={(data) => {
        delete data["billing_duedate_label"];
        delete data["billing_published_label"];
        delete data["Building"];
        delete data["created_on"];
        delete data["deleted"];
        delete data["enable"];
        delete data["management_id_label"];
        delete data["modified_on"];
        delete data["out_range"];
        delete data["pg_markup"];
        delete data["settlement_bank_label"];
        delete data["xenplatform_email"];
        delete data["xenplatform_id"];
        delete data["xenplatform_ready"];
        delete data["xenplatform_va_bca"];
        delete data["xenplatform_va_bni"];
        delete data["xenplatform_va_bri"];
        delete data["xenplatform_va_mandiri"];
        dispatch(editBuildingManagement(data, selected.id, history, auth.role));
      }}
      add={(data) => {
        delete data["management_id_label"];
        delete data["settlement_bank_label"];
        delete data["billing_published_label"];
        delete data["billing_duedate_label"];
        dispatch(createBuildingManagement(data, history));
      }}
      renderChild={(props) => {
        const { setFieldValue, values, errors } = props;

        return (
          <Form className="Form">
            {selected.id ? (
              <Input
                {...props}
                label="Select Management"
                name="management_id"
                options={managements}
                disabled
              />
            ) : (
              <Input
                {...props}
                label="Select Management"
                name="management_id"
                options={managements}
              />
            )}
            <Input
              {...props}
              label="In Range"
              name="in_range"
              suffix="km"
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
            />
            <Input
              {...props}
              label="Settlement Bank"
              name="settlement_bank"
              placeholder="-- Select your bank --"
              options={banks}
            />
            <Input
              {...props}
              label="Settlement Account No"
              name="settlement_account_no"
              placeholder="Enter account number"
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
            />
            <Input
              {...props}
              label="Settlement Account Name"
              name="settlement_account_name"
              placeholder="Enter account name"
            />
            <Input
              {...props}
              label="Billing Published (Date)"
              name="billing_published"
              placeholder="Set publish date"
              hint="Billing date published every month"
              options={dateArray}
            />
            <Input
              {...props}
              label="Billing Due (Date)"
              name="billing_duedate"
              hint="Billing due date every month"
              placeholder="Set due date"
              options={dateArray}
            />
            <Input
              {...props}
              label="Penalty Fee"
              name="penalty_fee"
              placeholder="Input value: 1 - 100"
              suffix="%"
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
            />
            <Input
              {...props}
              label="Auto Assign"
              name="auto_assign"
              type="radio"
              options={[
                { value: "y", label: "Yes", id: "y_assign" },
                { value: "n", label: "No", id: "n_assign" },
              ]}
            />
            <Input
              {...props}
              label="Auto Assign Limit"
              name="auto_assign_limit"
              suffix="task(s)"
              placeholder="Set limit"
              hint="Max. limit of tasks that can be taken by staff"
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
            />
            <Input
              {...props}
              label="Auto Assign Schedule"
              name="auto_assign_schedule"
              type="radio"
              options={[
                { value: "y", label: "Yes", id: "y_schedule" },
                { value: "n", label: "No", id: "n_schedule" },
              ]}
            />
            <Input
              {...props}
              label="Auto Assign Schedule Day"
              name="auto_assign_schedule_day"
              suffix="day(s)"
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
            />
            <Input
              {...props}
              label="Courier Fee"
              name="courier_fee"
              placeholder="10000"
              prefix="Rp."
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
            />
            <Input
              {...props}
              label="Courier Internal Markup"
              name="courier_internal_markup"
              suffix="%"
              placeholder="Input value: 1 - 100"
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
            />
            <Input
              {...props}
              label="Courier External Markup"
              name="courier_external_markup"
              suffix="%"
              placeholder="Input value: 1 - 100"
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
            />
            <Input
              {...props}
              label="Using Xenplatform"
              name="xenplatform_active"
              type="radio"
              options={[
                { value: "yes", label: "Yes", id: "yes_xenplatform_active" },
                { value: "no", label: "No", id: "no_xenplatform_active" },
              ]}
            />

            <SubmitButton loading={loading} errors={errors} />
          </Form>
        );
      }}
    />
  );
}

export default Component;
