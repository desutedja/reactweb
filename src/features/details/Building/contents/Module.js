import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { get, post } from '../../../slice';
import { endpointAdmin } from '../../../../settings';
import ClinkLoader from '../../../../components/ClinkLoader';

const modules = [
  {label: 'Security', value: 'security'},
  {label: 'Technician', value: 'technician'},
  {label: 'Merchant', value: 'merchant'},
  {label: 'Billing', value: 'billing'},
  {label: 'Advertisement', value: 'advertisement'}
]

// const active_modules = [
//   // 'technician',
//   // 'security',
//   // 'merchant',
//   // 'billing',
//   // 'advertisement',
// ]

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

function useDidUpdateEffect(fn, inputs) {
  const didMountRef = useRef(false);

  useEffect(() => {
    if (didMountRef.current)
      fn();
    else
      didMountRef.current = true;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, inputs);
}

export default (props) => {
  const {auth} = useSelector(state => state)
  const {id} = useParams()
  const dispatch = useDispatch()
  const [activeModules, setActiveModules] = useState([]);
  const [modulesLabel, setModulesLabel] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (auth.role !== 'sa') return;
    dispatch(get(endpointAdmin + '/modules/building?id=' + id,
      res => {
        setActiveModules(res.data.data.active_modules)
        setModulesLabel(modulesFiltered(modules, res.data.data.active_modules))
        setIsLoading(false);
      },
      err => console.log(err.response)
      ))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.role, id])

  function toggleButton() {
    if (auth.role !== 'sa') return;
      setIsLoading(true)
      dispatch(post(endpointAdmin + '/modules/building?id=' + id,
        {
          active_modules: activeModules
        },
        res => {
          setIsLoading(false)
        }
      ))
  }

  useDidUpdateEffect(toggleButton, [activeModules])
  
  // useEffect(() => {
  //   if (auth.role !== 'sa') return;
  //   setIsLoading(true)
  //   dispatch(post(endpointAdmin + '/modules/building?id=' + id,
  //     {
  //       active_modules: activeModules
  //     },
  //     res => {
  //       setIsLoading(false)
  //     }
  //   ))

  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [activeModules])


  return (
    <>
      <div className="row no-gutters mt-4">
        {modulesLabel && modulesLabel.map((el, i) => (
        <div key={i}
        className="col-12 col-sm-6 col-md-6 col-lg
        d-flex justify-content-center p-2">
          <SwitchBox
            value={el.value}
            onClick={e => {
              activeModules.find(am => am === e) ?
              setActiveModules(activeModules.filter(am => am !== e)) :
              setActiveModules([e, ...activeModules])
            }}
            label={el.label}
          />
        </div>
        ))}
        {isLoading && (
        <div className="col-12 d-flex flex-column justify-content-center align-items-center">
          <ClinkLoader />
          <span className="mt-2 text-secondary">please wait...</span>
        </div>
        )}
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
