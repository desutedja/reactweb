import React from "react";
import { Field } from "formik";
import { FiAlertCircle } from "react-icons/fi";

function RadioInputVoucher({ onChange = () => {}, ...props }) {
  const { options = [], values, name, handleChange, errors, touched } = props;

  return (
    <div className="Radio row">
      {options.map((el) => (
        <div className="col" style={{ maxWidth: 300 }} key={el.value}>
          <div className="form-check">
            <label
              className="form-check-label m-0"
              htmlFor={typeof el.id == "undefined" ? el.label : el.id}
              style={{ cursor: "pointer" }}
            >
              <Field
                className="form-check-input radio-voucher"
                type="radio"
                multiple
                name={name}
                id={typeof el.id == "undefined" ? el.label : el.id}
                value={el.value}
                checked={values[name] === el.value}
                onChange={(e) => {
                  onChange(e.target.value);
                  handleChange(e);
                }}
              />
              <div>
                <b style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>
                  {el.label}
                </b>
                <p style={{ fontSize: 10, fontWeight: 400, marginTop: 6 }}>
                  {el.desc}
                </p>
              </div>
            </label>
          </div>
        </div>
      ))}
      {errors[name] && touched[name] ? (
        <div className="Input-error">
          <FiAlertCircle
            style={{
              marginRight: 4,
            }}
          />
          {errors ? errors[name] : ""}
        </div>
      ) : null}
    </div>
  );
}

export default RadioInputVoucher;
