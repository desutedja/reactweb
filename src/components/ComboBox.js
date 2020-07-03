import React, {useEffect, useState} from 'react';
import useAutocomplete from '@material-ui/lab/useAutocomplete';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    position: 'relative'
  },
  label: {
    display: 'block',
  },
  input: {
    width: '100%',
  },
  listbox: {
    width: '100%',
    margin: '0 0 5rem 0',
    padding: 0,
    zIndex: 1,
    position: 'absolute',
    listStyle: 'none',
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
    maxHeight: 600,
    border: '1px solid rgba(0,0,0,.25)',
    borderRadius: '5px',
    '& li': {
      padding: '8px 12px',
    },
    '& li[data-focus="true"]': {
      backgroundColor: '#4a8df6',
      color: 'white',
      cursor: 'pointer',
    },
    '& li:active': {
      backgroundColor: '#2977f5',
      color: 'white',
    },
  },
}));

export default function UseAutocomplete({
  options = [], label = '', comboValue = '', setComboValue
}) {
  const [indexValue, setIndexValue] = useState(options.findIndex(option => option.value === comboValue));
  const [defaultValue, setDefaultValue] = useState(options[indexValue])
  // const indexValue = options.findIndex(option => option.value === inputValue);

  useEffect(() => {
    setIndexValue(0)
  }, [options])
  const classes = useStyles();
  const {
    getRootProps,
    // getInputLabelProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions
  } = useAutocomplete({
    id: label,
    onChange: setComboValue,
    defaultValue: defaultValue,
    options: options,
    getOptionLabel: (option) => option.label,
  });
   
  return (
    <div className={classes.wrapper}>
      <div {...getRootProps()}>
        {/* <label className={classes.label} {...getInputLabelProps()}>
          useAutocomplete
        </label> */}
        <input className={classes.input} {...getInputProps()} placeholder={label}/>
      </div>
      {groupedOptions.length > 0 ? (
        <ul className={classes.listbox} {...getListboxProps()}>
          {groupedOptions.map((option, index) => (
            <li {...getOptionProps({ option, index })} value={option.value} >{option.label}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}