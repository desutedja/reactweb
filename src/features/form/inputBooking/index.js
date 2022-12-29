import React from "react";

import TextInput from "./Text";
import MultiSelectInput from "./MultiSelect";
import RadioInput from "./Radio";
import FileInput from "./File";
import Editor from "./Editor";
import MultiSelectTable from "./MultiSelectTable";
import RadioInputBook from "./RadioFacility";

function Input({ optional = false, ...props }) {
  const {
    label = "",
    sublabel = "",
    actionlabels = {},
    compact,
    type = "text",
    hidden,
    name,
    hint = "",
    limit = "",
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
      case "multiselecttable":
        return (
          <MultiSelectTable
            name={fixedName}
            {...inputProps}
            resetForm={resetForm}
          />
        );
      case "radio":
        return <RadioInput name={fixedName} {...inputProps} />;
        case "radiobook":
          return <RadioInputBook name={fixedName} {...inputProps} />;
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
        (type === "multiselecttable" ? " multiselecttable" : "") +
        (hidden ? " hidden" : "")
      }
    >
      {!compact && (
        <>
          <div style={{ display: "flex" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div>
                <label className="Input-label" htmlFor={label}>
                  {label}
                </label>
              </div>
              {optional && (
                <span
                  style={{
                    marginLeft: 4,
                    color: "grey",
                  }}
                >
                  (Optional)
                </span>
              )}
            </div>
            {sublabel !== "" && (
              <div>
                <label className="Input-sublabel" htmlFor={label}>
                  {sublabel}
                </label>
              </div>
            )}
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
            <div style={{ marginBottom: "8px" }}>
              *{hint}
            </div>
          )}
        </>
      )}
      {renderInput(type)}
      {limit && (  
        <span
          style={{
            fontSize: "12px",
            color: "grey",
            textAlign: "right",
          }}
        >
          {limit}
        </span>
      )}
    </div>
  );
}

export default Input;
