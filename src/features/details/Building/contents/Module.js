import React, { useState } from 'react';

const modules = [
  {label: 'Security', value: 'security'},
  {label: 'Technician', value: 'technician'},
  {label: 'Merchant', value: 'merchant'},
  {label: 'Billing', value: 'billing'}
]

export default () => {
  return (
    <>
      <div className="row no-gutters mt-4">
        {modules && modules.map((el) => (
        <div className="col-12 col-sm-6 col-md-6 col-lg d-flex justify-content-center p-2">
          <SwitchBox
            label={el.label}
          />
        </div>
        ))}
      </div>
    </>
  )
}

const SwitchBox = ({
  label = '', value, ...rest
}) => {
  const [inputValue, setInputValue] = useState((value && value) || false)
  return (
    <>
      <div className="switch-box">
        <input
          className="" type="checkbox"
          id={label.toLowerCase()}
          value={inputValue}
          onClick={() => setInputValue(!inputValue)}
          {...rest}
        />
        <label
          className={inputValue ? 'switch-on' : 'switch-off'}
          htmlFor={label.toLowerCase()}
        >
          {label}: {inputValue ? 'on' : 'off'}
        </label>
      </div>
    </>
  )
}
