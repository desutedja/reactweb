import React, { useState, useRef } from 'react';

import Modal from './Modal';
import Loading from './Loading';
import { useDispatch } from 'react-redux';
import { post } from '../features/slice';
import exportFromJSON from 'export-from-json';
import { endpointBilling } from '../settings';

const billingEndpoint = endpointBilling + "/management/billing";

const SetAsPaidSelected = (
    open,
    toggle,
    resultComponent = '',
    data,) => {
    const [result, setResult] = useState('');
    const [openRes, setOpenRes] = useState(false);
    const [loading, setLoading] = useState(false);
    let dispatch = useDispatch();
  
    return (
      <>
    {resultComponent &&<Modal
        title={"Result"}
        isOpen={openRes}
        toggle={() => {
            setOpenRes(false);
        }}
        okLabel={"Close"}
        disableSecondary={true}
        onClick={() => {
            setOpenRes(false);
        }}
    >
        { resultComponent(result) }
    </Modal>}
    <Modal
              isOpen={open}
              toggle={() => {
                  setResult('');
                  toggle();
              }}
              title="Set As Paid Selected"
              okLabel={"Submit"}
              disablePrimary={loading}
              disableSecondary={loading}
              onClick={result ?
                  () => {
                      console.log(result)
                  }
                  :
                  () => {
                    setLoading(true);
  
                    dispatch(post(billingEndpoint + "/set_as_paid",
                    data, res => {
                        console.log(res.data.data);
                        exportFromJSON({ data: res.data.data.errorList })
                        setResult(res.data.data);
                        setLoading(false);
                        if (resultComponent) {
                            setOpenRes(true)
                        }
                        toggle();
                        // resultComponent ? setOpenRes(true) : toggle();
                    }, err => {
                        setResult('');
                        setLoading(false);
                        toggle();
                    }))
                }}
        >
        </Modal>
    </>
    )
    
    // dispatch(startAsync());
    // dispatch(
    //   post(
    //     billingEndpoint + "/set_as_paid",
    //       data,
    //     (res) => {
    //       dispatch(
    //         setInfoSetAsPaid({
    //           color: "success",
    //           message: `Selected billing has been set to paid.`,
    //         })
    //       );
  
    //       dispatch(refresh());
    //       dispatch(stopAsync());
    //     },
    //     (err) => {
    //       dispatch(
    //         setInfo({
    //           color: "danger",
    //           message: `No data found or selected billing is already Paid.`,
    //         })
    //       );
  
    //       dispatch(refresh());
    //       dispatch(stopAsync());
    //     }
    //   )
    // );
  };
  export default SetAsPaidSelected;