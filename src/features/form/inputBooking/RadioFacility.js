import React from "react";
import { Field } from "formik";
import { FiAlertCircle } from "react-icons/fi";

function RadioInputBook({ onChange = () => {}, ...props }) {
  const { options = [], values, name, handleChange, errors, touched } = props;

  return (
    <div className="Radio row">
      {options.map((el) => (
        <div className="col" key={el.value}>
          <div className="form-check">
            <label
              className="form-check-label m-0"
              htmlFor={typeof el.id == "undefined" ? el.label : el.id }
              style={{cursor: "pointer"}}
            >
            <Field
              className="form-check-input radio-booking"
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
            <img src={(require('./../../../assets/ic-'+ (el.label.toString().toLowerCase()) +'-disable.jpg'))} width="40" height="40" />
              <span className="ml-2">
                {el.label}
              </span>
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

export default RadioInputBook;
