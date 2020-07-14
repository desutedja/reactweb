import React, { useState, useEffect } from 'react';

const modules = [
  {label: 'Security', value: 'security'},
  {label: 'Technician', value: 'technician'},
  {label: 'Merchant', value: 'merchant'},
  {label: 'Billing', value: 'billing'},
  {label: 'Advertisement', value: 'advertisement'}
]

const active_modules = [
  // 'technician',
  // 'security',
  // 'merchant',
  // 'billing',
  'advertisement',
]

const modulesFiltered = (arrA, arrB) => {
  let res = [];
  for (let i = 0; i < arrA.length; i++) {
    const truthy = arrB.map(b => b === arrA[i].value).find(bool => bool === true)
    res.push(
      {label: arrA[i].label, value: truthy || false}
    );
  }
  return res;
}

export default () => {
  const [activeModules, setActiveModules] = useState(active_modules || [])

  useEffect(() => {
    console.log(activeModules)
  }, [activeModules])
  return (
    <>
      <div className="row no-gutters mt-4">
        {modulesFiltered && modulesFiltered(modules, activeModules).map((el, i) => (
        <div key={i}
        className="col-12 col-sm-6 col-md-6 col-lg
        d-flex justify-content-center p-2">
          <SwitchBox
            value={el.value}
            onClick={e => activeModules.find(am => am === e) ?
              setActiveModules(activeModules.filter(am => am !== e)) :
              setActiveModules([e, ...activeModules])
            }
            label={el.label}
          />
        </div>
        ))}
      </div>
    </>
  )
}

const SwitchBox = ({
  label = '', value, onClick, ...rest
}) => {

  const [inputValue, setInputValue] = useState((value && value) || false);

  return (
    <>
      <div className={"switch-box " + (inputValue ? 'switch-on' : 'switch-off')}>
        <input
          className="" type="checkbox"
          id={label.toLowerCase()}
          value={inputValue}
          onClick={() => setInputValue(!inputValue)}
          {...rest}
        />
        <label
          className="px-4 py-3"
          htmlFor={label.toLowerCase()}
          onClick={() => onClick(label.toLowerCase())}
        >
          <span className="text-center">{label}: {inputValue ? 'on' : 'off'}</span>
        </label>
      </div>
    </>
  )
}
