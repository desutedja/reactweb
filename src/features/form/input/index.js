import React from "react";

import TextInput from "./Text";
import MultiSelectInput from "./MultiSelect";
import RadioInput from "./Radio";
import FileInput from "./File";
import Editor from "./Editor";

function Input({ optional = false, ...props }) {
  const {
    label = "",
    actionlabels = {},
    compact,
    type = "text",
    hidden,
    name,
    hint = "",
  } = props;
  const fixedName = name ? name : label.toLowerCase().replace(/ /g, "_");

  //extract non input props to reduce warnings, there should be other ways lol but at this point, whatevs
  const {
    isSubmitting,
    isValidating,
    submitCount,
    initialValues,
    initialErrors,
    initialTouched,
    initialStatus,
    handleBlur,
    handleReset,
    handleSubmit,
    resetForm,
    setErrors,
    setFormikState,
    setFieldTouched,
    setFieldError,
    setStatus,
    setSubmitting,
    setTouched,
    setValues,
    submitForm,
    validateForm,
    validateField,
    isValid,
    unregisterField,
    registerField,
    getFieldProps,
    getFieldMeta,
    getFieldHelpers,
    validateOnBlur,
    validateOnChange,
    validateOnMount,
    dirty,
    ...inputProps
  } = props;

  const renderInput = (type) => {
    switch (type) {
      case "editor":
        return <Editor name={fixedName} {...inputProps} />;
      case "multiselect":
        return <MultiSelectInput name={fixedName} {...inputProps} />;
      case "radio":
        return <RadioInput name={fixedName} {...inputProps} />;
      case "file":
        return <FileInput name={fixedName} {...inputProps} />;
      case "textarea":
        return <TextInput as="textarea" name={fixedName} {...inputProps} />;
      case "select":
      default:
        return <TextInput name={fixedName} {...inputProps} />;
    }
  };

  return (
    <div
      className={
        "Input" +
        (type === "textarea" ? " textarea" : "") +
        (type === "select" ? " select" : "") +
        (type === "multiselect" ? " multiselect" : "") +
        (hidden ? " hidden" : "")
      }
    >
      {!compact && (
        <>
          <div style={{ display: "flex" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <label className="Input-label" htmlFor={label}>
                {label}
              </label>
              {optional && (
                <span
                  style={{
                    marginLeft: 4,
                    color: "grey",
                  }}
                >
                  (optional)
                </span>
              )}
            </div>
            {Object.keys(actionlabels).map((action) => (
              // eslint-disable-next-line jsx-a11y/anchor-is-valid
              <a
                key={action}
                style={{ margin: "4px" }}
                href="#"
                onClick={actionlabels[action]}
              >
                {action}
              </a>
            ))}
          </div>
          {hint && (
            <div style={{ fontStyle: "italic", marginBottom: "8px" }}>
              *{hint}
            </div>
          )}
        </>
      )}
      {renderInput(type)}
    </div>
  );
}

export default Input;
