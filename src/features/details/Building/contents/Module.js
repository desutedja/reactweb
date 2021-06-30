import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import Modal from '../../../../components/Modal';
import { get, post } from '../../../slice';
import { endpointAdmin } from '../../../../settings';
import ClinkLoader from '../../../../components/ClinkLoader';

const modules = [
  {label: 'Merchant', value: 'merchant'},
  {label: 'Billing', value: 'billing'},
  {label: 'Advertisement', value: 'advertisement'},
  {label: 'Security', value: 'security'},
  {label: 'Technician', value: 'technician'},
  {label: 'Internal Courier', value: 'internal_courier'},
  {label: 'Separate Billing', value: 'separate_billing'},
  {label: 'CCTV', value: 'cctv'}
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
        {label: arrA[i].label, truthvalue: truthy || false,
            value: arrA[i].value}
    );
  }
  return res;
}

    /*
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
*/

export default (props) => {
  const {auth} = useSelector(state => state)
  const {id} = useParams()
  const dispatch = useDispatch()
  const [activeModules, setActiveModules] = useState([]);
  const [modulesLabel, setModulesLabel] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [clickedModule, setClickedModule] = useState('');
  const [confirmChange, setConfirmChange] = useState(false);
  const [refresh, setRefresh] = useState(true);

  useEffect(() => {
    if (auth.role !== 'sa') return;
    refresh && dispatch(get(endpointAdmin + '/modules/building?id=' + id,
      res => {
        setActiveModules(res.data.data.active_modules)
        setModulesLabel(modulesFiltered(modules, res.data.data.active_modules))
        setIsLoading(false);
        setRefresh(false);
      },
      err => console.log(err.response)
      ))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.role, id, refresh])

  function submitChange() {
    if (auth.role !== 'sa') return;
      setIsLoading(true)

      const updated = activeModules.find(am => am === clickedModule.value) ?
      activeModules.filter(am => am !== clickedModule.value) : 
      [clickedModule.value, ...activeModules]

      dispatch(post(endpointAdmin + '/modules/building?id=' + id,
        {
          active_modules: updated
        },
        res => {
          setConfirmChange(false);
          setIsLoading(false)
          setRefresh(true);
        }
      ))
  }

   //useDidUpdateEffect(submitChange, [activeModules])
  
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
        <Modal 
            isOpen={confirmChange}
            disableHeader={true}
            onClick={submitChange}
            toggle={() => { 
                setConfirmChange(false)
                setModulesLabel(modulesLabel.map((el) => {
                    if (el.value === clickedModule.value) {
                        return { value: el.value, truthvalue: clickedModule.truthvalue, label: el.label  }
                    } else {
                        return el
                    }
                }))
            } }
            okLabel={"Confirm"}
            cancelLabel={"Cancel"}
        >
            Are you sure you want to {activeModules.find(am => am === clickedModule.value) === clickedModule.value? "enable" : "disable"} <b>{clickedModule.label}</b> module in this building? 
        </Modal>
      <div className="row no-gutters mt-4">
        {modulesLabel && modulesLabel.map((el, i) => (
        <div key={i}
        className="col-12 col-sm-6 col-md-6 col-lg
        d-flex justify-content-center p-2">
          <div className={"switch-box " + (el.truthvalue ? 'switch-on' : 'switch-off')}>
            <input
              className="" type="checkbox"
              id={el.label.toLowerCase()}
              value={el.truthvalue}
              onClick={props.view ? null : e => {
                  setClickedModule(el);
                  setConfirmChange(true);
               }}
            />
            <label
              className="px-4 py-3"
              htmlFor={el.label.toLowerCase()}
            >
              <span className="text-center">{el.label}: {el.truthvalue ? 'on' : 'off'}</span>
            </label>
          </div>
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
