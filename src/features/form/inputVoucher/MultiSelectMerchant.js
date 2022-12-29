import React from "react";
import useAutocomplete from "@material-ui/lab/useAutocomplete";
import NoSsr from "@material-ui/core/NoSsr";
import { FiX, FiCheck } from "react-icons/fi";

function MultiSelectInputMerchant({
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
    id: "multiselectinputmerchant",
    defaultValue: defaultValue,
    multiple: true,
    options: options,
    onInputChange: onInputChange,
    onChange: onValueChange,
    getOptionLabel: (option) => option.merchant_name,
    getOptionSelected: (option, id) => option.id === id.id,
    getOptionDisabled: (option) => option.id === 0,
  });

  function Tag({ merchant_name, onDelete, ...props }) {
    return (
      <div {...props} className="MultiSelectItem">
        <span>{merchant_name}</span>
        <FiX onClick={onDelete} />
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
                  <span>{option.merchant_name}</span>
                  <FiCheck size="20" />
                </li>
              ))
            )}
          </ul>
          <div ref={setAnchorEl} className={"MultiSelectItemWrapper"}>
            {value.map((option, index) => (
              <Tag merchant_name={option.merchant_name} {...getTagProps({ index })} />
            ))}
          </div>
        </div>
      </div>
    </NoSsr>
  );
}

export default MultiSelectInputMerchant;
