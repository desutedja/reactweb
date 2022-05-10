import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import SectionSeparator from "../../components/SectionSeparator";
import { editStaff, createStaff } from "../slices/staff";
import {
  endpointResident,
  endpointAdmin,
  endpointManagement,
} from "../../settings";
import { get } from "../slice";
import Template from "./components/TemplateWithFormik";
import countries from "../../countries";

import { Form } from "formik";
import Input from "./input";
import { staffSchema } from "./services/schemas";
import SubmitButton from "./components/SubmitButton";
import { toSentenceCase } from "../../utils";
import Module from "../details/Building/contents/Module";

const staffPayload = {
  staff_role: "",
  on_centratama: "1",
  staff_specialization: "",
  building_management_id: "",
  staff_id: "",
  status: "active",
  firstname: "",
  lastname: "",
  email: "",
  phone: "",
  nationality: "",
  gender: "P",
  marital_status: "",
  address: "",
  province: "",
  city: "",
  district: "",
  account_bank: "",
  account_number: "",
  account_name: "",

  staff_role_label: "",
  staff_specialization_label: "",
  building_management_id_label: "",
  nationality_label: "",
  marital_status_label: "",
  province_label: "",
  city_label: "",
  district_label: "",
  account_bank_label: "",
};

let staff_roles = [
  { value: "gm_bm", label: "BM Manager" },
  { value: "pic_bm", label: "BM Admin" },
  { value: "technician", label: "Service Staff" },
  { value: "courier", label: "Courier Staff" },
  { value: "security", label: "Security Staff" },
];

function Component() {
  const initialMount = useRef(true);
  const { banks } = useSelector((state) => state.main);
  const { loading, selected } = useSelector((state) => state.staff);
  const { role, user } = useSelector((state) => state.auth);
  const [staffRole, setStaffRole] = useState("");
  const [bManagements, setBManagements] = useState([]);
  const [bmId, setBmId] = useState("");
  const [departments, setDepartments] = useState([]);
  const [typeDepartment, setTypeDepartment] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState([]);

  const [districts, setDistricts] = useState([]);
  const [city, setCity] = useState("");
  const [cities, setCities] = useState([]);

  const [province, setProvince] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [module, setModule] = useState([]);
  const [selectedModule, setSelectedModule] = useState([]);

  let dispatch = useDispatch();
  let history = useHistory();

  useEffect(() => {
    console.log(selectedDepartment);
  }, [selectedDepartment]);

  useEffect(() => {
    console.log(selectedModule);
  }, [selectedModule]);

  useEffect(() => {
    if (initialMount.current) {
      initialMount.current = false;
      return;
    }
    if (role === "sa") {
      if (bmId && typeDepartment) {
        dispatch(
          get(
            endpointManagement +
              "/admin/department?" +
              "bm_id=" +
              bmId +
              "&type=" +
              typeDepartment,
            (res) => {
              const formatted = res.data.data.map((el) => ({
                label: el.department_name,
                value: el.id,
              }));
              setDepartments(formatted || []);
            }
          )
        );
      }
      return;
    }
    if (typeDepartment) {
      dispatch(
        get(
          endpointManagement + "/admin/department?" + "type=" + typeDepartment,
          (res) => {
            const formatted = res.data.data.map((el) => ({
              label: el.department_name,
              value: el.id,
            }));
            setDepartments(formatted || []);
          }
        )
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bmId, typeDepartment]);

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
    console.log(bmId, staffRole);
    if (bmId === "" && staffRole === "") {
      return;
    }
    dispatch(
      get(
        endpointAdmin + "/modules/available/" + bmId + "?role=" + staffRole,
        (res) => {
          let formatted = res.data.data.module_detail.map((el) => ({
            label: toSentenceCase(el.access.replace("_", " ")),
            value: el.access,
            id: el.access_id,
            type: toSentenceCase(el.access_type),
          }));
          console.log("asdasd" + JSON.stringify(formatted));
          setModule([...formatted]);
        }
      )
    );
  }, [bmId, staffRole]);

  useEffect(() => {
    dispatch(
      get(
        endpointResident + "/geo/province",

        (res) => {
          let formatted = res.data.data.map((el) => ({
            label: el.name,
            value: el.id,
          }));
          setProvinces(formatted);
        }
      )
    );
  }, [dispatch]);

  useEffect(() => {
    setCity("");
    (province || selected.province) &&
      dispatch(
        get(
          endpointResident +
            "/geo/province/" +
            (province ? province : selected.province),

          (res) => {
            let formatted = res.data.data.map((el) => ({
              label: el.name,
              value: el.id,
            }));
            setCities(formatted);
          }
        )
      );
  }, [dispatch, province, selected.province]);

  useEffect(() => {
    (city || selected.city) &&
      dispatch(
        get(
          endpointResident + "/geo/city/" + (city ? city : selected.city),

          (res) => {
            let formatted = res.data.data.map((el) => ({
              label: el.name,
              value: el.id,
            }));
            setDistricts(formatted);
          }
        )
      );
  }, [city, dispatch, selected.city]);

  useEffect(() => {
    if (role === "bm") {
      const blacklist_modules = user.blacklist_modules;
      const isSecurity = blacklist_modules.find(
        (item) => item.module === "security"
      )
        ? true
        : false;
      const isInternalCourier = blacklist_modules.find(
        (item) => item.module === "internal_courier"
      )
        ? true
        : false;
      const isTechnician = blacklist_modules.find(
        (item) => item.module === "technician"
      )
        ? true
        : false;

      if (isTechnician) delete staff_roles[2];
      if (isInternalCourier) delete staff_roles[3];
      if (isSecurity) delete staff_roles[4];
    }
  }, [role, user]);

  return (
    <Template
      slice="staff"
      payload={
        selected.id
          ? {
              ...staffPayload,
              ...selected,
              phone: selected.phone.slice(2),
              on_centratama: parseInt(selected.on_centratama)
                ? selected.on_centratama + ""
                : "0",
              staff_specialization: selected.staff_specialization
                ? selected.staff_specialization
                : "",
            }
          : staffPayload
      }
      schema={staffSchema}
      formatValues={(values) => ({
        ...values,
        on_centratama: parseInt(values.on_centratama, 10),
        phone: "62" + values.phone,
        province: parseInt(values.province, 10),
        city: parseInt(values.city, 10),
        district: parseInt(values.district, 10),
        building_management_id: values.building_management_id
          ? values.building_management_id
          : user.building_management_id,
      })}
      edit={(data) => {
        delete data[undefined];
        dispatch(editStaff(data, history, selected.id));
      }}
      add={(data) => {
        delete data[undefined];
        console.log(data);
        dispatch(createStaff(data, history));
      }}
      renderChild={(props) => {
        const { values, errors, setFieldValue } = props;
        if (values.building_management_id !== "") {
          setBmId(values.building_management_id);
        } else if (user.building_management_id != null) {
          setFieldValue("building_management_id", user.building_management_id);
        }

        if (values.staff_role) {
          setStaffRole(values.staff_role);
        }
        if (
          values.staff_role === "technician" ||
          values.staff_role === "pic_bm"
        )
          setTypeDepartment("service");
        if (values.staff_role === "security") setTypeDepartment("security");
        if (values.staff_role === "gm_bm") setTypeDepartment("all");

        if (
          typeof values.departments != "undefined" &&
          values.departments.length > 0 &&
          typeof values.department_ids === "undefined"
        ) {
          const departmentIDs = values.departments.map((el) => ({
            label: el.department_name,
            value: el.id,
          }));
          console.log(values.department_ids);
          setSelectedDepartment(departmentIDs);
          setFieldValue("department_ids", departmentIDs);
        }
        return (
          <Form className="Form">
            {!selected.id && (
              <Input
                {...props}
                label="Staff Role"
                options={staff_roles}
                onChange={(val) => {
                  setStaffRole(val.value);
                }}
              />
            )}
            {values["staff_role"] === "courier" && (
              <Input
                {...props}
                label="On Centratama?"
                name="on_centratama"
                type="radio"
                options={[
                  { value: "1", label: "Yes" },
                  { value: "0", label: "No" },
                ]}
              />
            )}
            {/* {values['staff_role'] === "technician" && <Input {...props} label="Specialization"
                        name="staff_specialization"
                        options={[
                            { value: 'electricity', label: 'Electricity' },
                            { value: 'plumbing', label: 'Plumbing' },
                            { value: 'others', label: 'Others' },
                        ]} />} */}
            {role === "sa" && (
              <Input
                {...props}
                label="Building Management"
                name="building_management_id"
                options={bManagements}
              />
            )}
            {/* {(values["staff_role"] === "technician" ||
              values["staff_role"] === "security" ||
              values["staff_role"] === "pic_bm") && ( */}
            <Input
              {...props}
              type="multiselect"
              label="Select Department(s)"
              name="department_ids"
              defaultValue={
                values.departments
                  ? values.departments.map((el) => ({
                      label: el.department_name,
                      value: el.id,
                    }))
                  : []
              }
              placeholder="Start typing department name to add"
              options={departments}
              onChange={(e, value) => {
                setSelectedDepartment(value);
              }}
            />
            {/* )} */}
            {(values["staff_role"] === "pic_bm" ||
              values["staff_role"] === "gm_bm") && (
              <Input
                {...props}
                label="Web Admin Access"
                type="radio"
                name="web_access"
                options={[
                  { value: "y", label: "Yes", id: "y_admin" },
                  { value: "n", label: "No", id: "n_admin" },
                ]}
              />
            )}
            <Input
              {...props}
              label="Resident Chat Access"
              type="radio"
              name="chat_access"
              options={[
                { value: "y", label: "Yes" },
                { value: "n", label: "No" },
              ]}
            />
            {module.length > 0 && (
              <ModuleTable
                options={[...module]}
                values={values.module_access}
                setFieldValue={(value) => (setFieldValue("module_access", value))}
              />
            )}
            <Input {...props} label="Staff Id" placeholder="KTP/SIM/Passport" />
            <Input
              {...props}
              label="Status"
              type="radio"
              options={[
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
              ]}
            />
            <SectionSeparator />

            <Input {...props} label="Firstname" />
            <Input {...props} label="Lastname" />
            <Input {...props} label="Email" />
            <Input {...props} label="Phone" prefix="+62" />

            <SectionSeparator />

            <Input {...props} label="Nationality" options={countries} />
            <Input
              {...props}
              label="Gender"
              type="radio"
              options={[
                { value: "P", label: "Female" },
                { value: "L", label: "Male" },
              ]}
            />
            <Input
              {...props}
              label="Marital Status"
              options={[
                { value: "single", label: "Single" },
                { value: "married", label: "Married" },
                { value: "divorce", label: "Divorced" },
                { value: "other", label: "Other" },
              ]}
              optional
            />
            <Input {...props} label="Address" type="textarea" optional />
            <Input
              {...props}
              label="Province"
              options={provinces}
              onChange={(el) => setProvince(el.value)}
              optional
            />
            {values.province && (
              <Input
                {...props}
                label="City"
                options={cities}
                onChange={(el) => setCity(el.value)}
                optional
              />
            )}
            {values.city && (
              <Input {...props} label="District" options={districts} optional />
            )}

            <SectionSeparator />

            <Input {...props} label="Account Bank" optional options={banks} />
            <Input {...props} label="Account Number" optional />
            <Input {...props} label="Account Name" optional />
            <SubmitButton loading={loading} errors={errors} />
          </Form>
        );
      }}
    />
  );
}

const ModuleTable = ({ options, setFieldValue, values }) => {
  const [moduleAccess, setModuleAccess] = useState([]);
  const [merged, setMerged] = useState(false);

  useEffect(() => {
    if (moduleAccess.length === 0) {
      console.log("optopt" + JSON.stringify(options));
      const newData = [...options];
      newData.map((item) => {
        item.privilege = {
          read: true,
          create: true,
          update: true,
          delete: true,
        };
        return item;
      });
      console.log("qweqwe:" + JSON.stringify(newData))
      setModuleAccess(newData);
      setFieldValue(newData);
    }
  }, [options]);

  useEffect(() => {}, [moduleAccess]);
  useEffect(() => {
    console.log("val2:" + JSON.stringify(values));
    if (typeof values === "undefined") {
      return;
    }
    let formatted = values.map((el) => {
      let fullValue = ["create", "read", "update", "delete"];
      let inclPrivArr = fullValue;
      if (typeof el.access_privilege === "string") {
        inclPrivArr = el.access_privilege.split(",");
      }
      let privilege = {};
      inclPrivArr.map((priv) => {
        privilege[priv] = true;
      });
      if (inclPrivArr.length !== fullValue.length) {
        let exclPrivArr = fullValue.filter(
          (x) => inclPrivArr.indexOf(x) === -1
        );
        exclPrivArr.map((priv) => {
          privilege[priv] = false;
        });
      }
      if (typeof el.access !== "undefined") {
        let value = {
          label: toSentenceCase(el.access.replace("_", " ")),
          value: el.access,
          id: el.access_id,
          type: toSentenceCase(el.access_type),
          privilege,
        };
        return value;
      } else {
        return el;
      }
    });
    if (merged) {
      return;
    }
    let merge = formatted.concat(moduleAccess);
    console.log("chxchx1:" +  JSON.stringify(formatted));
    console.log("chxchx2:" +  JSON.stringify(moduleAccess));
    merge = [...new Set([...formatted, ...moduleAccess])];
    console.log(merge, "merged");
    setModuleAccess([...merge]);
    setFieldValue([...merge]);
    setMerged(true);
  }, [values]);

  const [readAll, setReadAll] = useState(true);
  const [createAll, setCreateAll] = useState(true);
  const [updateAll, setUpdateAll] = useState(true);
  const [deleteAll, setDeleteAll] = useState(true);

  const handleChange = (index, privilege, value) => {
    const mod = [...moduleAccess];
    mod[index].privilege[privilege] = value;
    setModuleAccess([...mod]);
    setFieldValue(mod);
  };

  const setAll = (privilege) => {
    const mod = moduleAccess.map((el) => {
      let value = true;
      switch (privilege) {
        case "read":
          value = !readAll;
          setReadAll(value);
          break;
        case "create":
          value = !createAll;
          setCreateAll(value);
          break;
        case "update":
          value = !updateAll;
          setUpdateAll(value);
          break;
        case "delete":
          value = !deleteAll;
          setDeleteAll(value);
          break;
      }
      el.privilege[privilege] = value;
      return el;
    });
    console.log(mod);
    setModuleAccess([...mod]);
    setFieldValue(mod);
  };

  const setIndex = (index, value) => {
    const mod = [...moduleAccess];
    mod[index].privilege.read = value;
    mod[index].privilege.create = value;
    mod[index].privilege.update = value;
    mod[index].privilege.delete = value;
    setModuleAccess([...mod]);
    setFieldValue(mod);
  };

  return (
    <>
      <div class="Input" style={{ marginBottom: 0 }}>
        <label class="Input-label">Access Module</label>
      </div>
      <div class="css-table">
        <div class="css-table-header">
          <div style={{ width: "20%", height: 50, verticalAlign: "middle" }}>
            Module
          </div>
          <div
            style={{ width: "10%", verticalAlign: "middle", cursor: "pointer" }}
            onClick={() => setAll("read")}
          >
            Read
          </div>
          <div
            style={{ width: "10%", verticalAlign: "middle", cursor: "pointer" }}
            onClick={() => setAll("create")}
          >
            Create
          </div>
          <div
            style={{ width: "10%", verticalAlign: "middle", cursor: "pointer" }}
            onClick={() => setAll("update")}
          >
            Update
          </div>
          <div
            style={{ width: "10%", verticalAlign: "middle", cursor: "pointer" }}
            onClick={() => setAll("delete")}
          >
            Delete
          </div>
          <div style={{ width: "10%", verticalAlign: "middle" }}>Type</div>
          <div style={{ width: "25%" }}></div>
        </div>

        <div class="css-table-body">
          {moduleAccess.length > 0 &&
            moduleAccess.map((el, index) => {
              console.log("modmod:" + JSON.stringify(moduleAccess))
              return (
                <div key={index} class="css-table-row">
                  <div style={{ textAlign: "left" }}>{el.label}</div>
                  <div>
                    <input
                      type="checkbox"
                      checked={el.privilege.read ? true : false}
                      onChange={() => {
                        handleChange(index, "read", !el.privilege.read);
                      }}
                    />
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      value="create"
                      onChange={() =>
                        handleChange(index, "create", !el.privilege.create)
                      }
                      checked={el.privilege.create}
                    />
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      value="update"
                      onChange={() =>
                        handleChange(index, "update", !el.privilege.update)
                      }
                      checked={el.privilege.update}
                    />
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      value="delete"
                      onChange={() =>
                        handleChange(index, "delete", !el.privilege.delete)
                      }
                      checked={el.privilege.delete}
                    />
                  </div>
                  <div>
                    <span>{el.type}</span>
                  </div>
                  <div>
                    <button
                      type="button"
                      style={{ color: 'white' }}
                      onClick={() => {
                        setIndex(index, true);
                      }}
                    >
                      All
                    </button>
                    <button
                      type="button"
                      style={{ marginLeft: 10, color: 'white' }}
                      onClick={() => {
                        setIndex(index, false);
                      }}
                    >
                      None
                    </button>
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
