import React, { useEffect, useState, useRef } from "react";
import useAutocomplete from "@material-ui/lab/useAutocomplete";
import SectionSeparator from "../../../components/SectionSeparator";
import NoSsr from "@material-ui/core/NoSsr";
import { FiX, FiCheck } from "react-icons/fi";
import { FieldArray, Field } from "formik";

function MultiSelectTable({
  placeholder,
  options,
  defaultValue = [],
  onBlur = () => {},
  onInputChange = () => {},
  onChange = () => {},
  ...props
}) {
  const { setFieldValue, name, fixedName } = props;

  const onValueChange = (e, val) => {
    onChange(e, val);
    if (
      val.length > 0 &&
      typeof val[val.length - 1].privilege === "undefined"
    ) {
      val[val.length - 1].privilege = {
        read: true,
        create: true,
        update: true,
        delete: true,
      };
    }
    setFieldValue && setFieldValue(name, val);
    setFieldValue && setFieldValue(fixedName, val);
  };

  const {
    getRootProps,
    getInputProps,
    getTagProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    inputValue,
    value,
    setAnchorEl,
  } = useAutocomplete({
    id: "multiselectinput",
    defaultValue: defaultValue,
    multiple: true,
    options: options,
    onInputChange: onInputChange,
    onChange: onValueChange,
    getOptionLabel: (option) => option.label,
    getOptionSelected: (option, value) => option.value === value.value,
    getOptionDisabled: (option) => option.value === 0,
  });

  function CheckboxList({ label, onDelete, ...props }) {
    let option = props.option,
      index = props.index;
    return (
      <div
        {...props}
        key={`${option.value}-${index}`}
        role="group"
        aria-labelledby="checkbox-group"
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <FiX
          enableBackground
          onClick={onDelete}
          style={{
            marginRight: 16,
            backgroundColor: "#e12029",
            color: "#ffffff",
            fontSize: 12,
            borderRadius: 20,
            width: 20,
            height: 20,
            padding: 3,
          }}
        />
        <p
          style={{
            marginRight: 16,
            flex: 1,
            // whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {option.label}
        </p>
        <Field
          name={`${option.value}`}
          type="checkbox"
          onClick={() => {
            let newValues = value;
            newValues[index].privilege.read = !option.privilege.read;
            setFieldValue("module_access", newValues);
          }}
          checked={option.privilege.read}
        ></Field>
        <Field
          name={`${option.value}`}
          type="checkbox"
          onClick={() => {
            let newValues = value;
            newValues[index].privilege.create = !option.privilege.create;
            setFieldValue("module_access", newValues);
          }}
          checked={option.privilege.create}
        />
        <Field
          name={`${option.value}`}
          type="checkbox"
          onClick={() => {
            let newValues = value;
            newValues[index].privilege.update = !option.privilege.update;
            setFieldValue("module_access", newValues);
          }}
          checked={option.privilege.update}
        />
        <Field
          name={`${option.value}`}
          type="checkbox"
          onClick={() => {
            let newValues = value;
            newValues[index].privilege.delete = !option.privilege.delete;
            setFieldValue("module_access", newValues);
          }}
          checked={option.privilege.delete}
        />
        <p
          style={{
            alignItems: "center",
            textAlign: "center",
            marginRight: 12,
            flex: 1,
          }}
        >
          {option.type}
        </p>
        <button
          type="button"
          style={{
            marginLeft: 16,
          }}
          onClick={() => {
            let newValues = value;
            newValues[index].privilege = {
              read: true,
              create: true,
              update: true,
              delete: true,
            };
            setFieldValue(`module_access`, newValues);
          }}
        >
          All
        </button>
        <button
          type="button"
          style={{
            marginLeft: 16,
          }}
          onClick={() => {
            let newValues = value;
            newValues[index].privilege = {
              read: false,
              create: false,
              update: false,
              delete: false,
            };
            setFieldValue(`module_access`, newValues);
          }}
        >
          None
        </button>
      </div>
    );
  }

  return (
    <NoSsr>
      <div>
        <div {...getRootProps()}>
          <div className="Input-container">
            <input {...getInputProps()} placeholder={placeholder} />
          </div>
          <ul className="MultiSelectDropDown" {...getListboxProps()}>
            {groupedOptions.length === 0 ? (
              inputValue.length > 0 ? (
                <li>
                  <span>No Result</span>
                </li>
              ) : null
            ) : (
              groupedOptions.map((option, index) => (
                <li
                  style={{ display: "flex" }}
                  {...getOptionProps({ index, option })}
                >
                  <span>{option.label}</span>
                  <FiCheck size="20" />
                </li>
              ))
            )}
          </ul>
          <div>
            <FieldArray
              name="privilege"
              render={(arrayHelpers) => (
                <div
                  className="Input"
                  style={{
                    maxWidth: 700,
                    marginTop: 20,
                    marginBottom: 20,
                  }}
                >
                  {value.length > 0 && (
                    <>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: 8,
                        }}
                      >
                        <p
                          style={{
                            alignItems: "center",
                            marginLeft: 16,
                            flex: 1,
                            textAlign: "center",
                            marginRight: 12,
                          }}
                        >
                          Module
                        </p>
                        <p
                          style={{
                            alignItems: "center",
                            textAlign: "right",
                            flex: 1,
                          }}
                        >
                          Read
                        </p>
                        <p
                          style={{
                            alignItems: "center",
                            textAlign: "right",
                            flex: 1,
                          }}
                        >
                          Create
                        </p>
                        <p
                          style={{
                            alignItems: "center",
                            textAlign: "right",
                            marginRight: -12,
                            flex: 1,
                          }}
                        >
                          Update
                        </p>
                        <p
                          style={{
                            textAlign: "right",
                            alignItems: "center",
                            marginRight: -12,
                            flex: 1,
                          }}
                        >
                          Delete
                        </p>
                        <p
                          style={{
                            alignItems: "center",
                            textAlign: "right",
                            flex: 1,
                            marginRight: -12,
                          }}
                        >
                          Type
                        </p>
                        <p
                          style={{
                            alignItems: "center",
                            flex: 1,
                          }}
                        ></p>
                        <p
                          style={{
                            alignItems: "center",
                            flex: 1,
                          }}
                        ></p>
                      </div>
                      <SectionSeparator
                        style={{ marginTop: 0, height: "auto" }}
                        title=""
                      />
                    </>
                  )}

                  {value.map((option, index) => (
                    <CheckboxList
                      label={option.label}
                      index={index}
                      option={option}
                      {...getTagProps({ index })}
                    />
                  ))}
                </div>
              )}
            />
          </div>
          {/* <div ref={setAnchorEl} className={"MultiSelectItemWrapper"}>
            {value.map((option, index) => (
              <Tag label={option.label} {...getTagProps({ index })} />
            ))}
          </div> */}
        </div>
      </div>
    </NoSsr>
  );
}

export default MultiSelectTable;
