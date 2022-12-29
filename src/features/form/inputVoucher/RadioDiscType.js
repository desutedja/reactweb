import React from "react";
import { Field } from "formik";
import { FiAlertCircle } from "react-icons/fi";

function RadioInputDiscType({ onChange = () => {}, ...props }) {
  const { options = [], values, name, handleChange, errors, touched } = props;

  return (
    <div className="Radio row">
      {options.map((el) => (
        <div
          className="col"
          style={{ maxWidth: 100, marginRight: 10 }}
          key={el.value}
        >
          <div className="form-check">
            <label
              className="form-check-label m-0"
              htmlFor={typeof el.id == "undefined" ? el.label : el.id}
              style={{ cursor: "pointer" }}
            >
              <Field
                className="form-check-input radio-voucher-box"
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
                <p style={{ fontSize: 14, fontWeight: 400 }}>
                  {el.label}
                </p>
              </div>
            </label>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RadioInputDiscType;
