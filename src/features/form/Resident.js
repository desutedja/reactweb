import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import SectionSeparator from '../../components/SectionSeparator';
import { createResident, editResident } from '../slices/resident';
import { endpointResident, endpointAdmin } from '../../settings';
import countries from '../../countries';
import { get, post } from '../slice';

import Template from "./components/TemplateWithFormik";
import { Form } from 'formik';
import { residentSchema } from "./services/schemas";
import Input from './input';
import SubmitButton from './components/SubmitButton';
import Modal from '../../components/Modal';

import Input2 from '../../components/Input';

const residentPayload = {
    email: "",
    firstname: "",
    lastname: "",
    phone: "",
    // reason: "",

    birthplace: "others",
    birthdate: null,
    nationality: null,
    gender: null,
    marital_status: null,
    occupation: null,
    address: null,
    province: null,
    city: null,
    district: null,
    building: null,
    unit:null,
    account_bank: null,
    account_name: null,
    account_no: null,

    birthplace_label: "Others",
    nationality_label: "",
    marital_status_label: "",
    occupation_label: "",
    province_label: "",
    city_label: "",
    district_label: "",
    account_bank_label: "",
}

function Component() {

    const { role, user } = useSelector((state) => state.auth);
    const [buildingList, setBuildingList] = useState("");
    const [building, setBuilding] = useState("");
    const [unit, setUnit] = useState("");
    const [units, setUnits] = useState([]);

    const { banks } = useSelector(state => state.main);
    const { selected, loading } = useSelector(state => state.resident);
    const [modalReason, setModalReason] = useState(false);

    const [emailRegistered, setEmailRegistered] = useState(false);
    const [exist, setExist] = useState(selected.id ? false : true);

    const [districts, setDistricts] = useState([]);

    const [city, setCity] = useState("");
    const [cities, setCities] = useState([]);

    const [province, setProvince] = useState("");
    const [provinces, setProvinces] = useState([]);

    const [bcities, setBCities] = useState([]);
    const [bcloading, setBCLoading] = useState(true);      

    let dispatch = useDispatch();
    let history = useHistory();
    let { state } = useLocation();

    useEffect(() => {
        if (role === "bm") {
            setBuilding(user.building_id);
        }else{
            setBuilding("1");
        }

      }, [dispatch]);

    useEffect(() => {
        dispatch(get(endpointResident + '/geo/province',

            res => {
                let formatted = res.data.data.map(el => ({ label: el.name, value: el.id }));
                setProvinces(formatted);
            }
        ))
    }, [dispatch]);

    useEffect(() => {
        setCity("");
        (province || selected.province) && dispatch(get(endpointResident + '/geo/province/' + (province || selected.province),

            res => {
                let formatted = res.data.data.map(el => ({ label: el.name, value: el.id }));
                setCities(formatted);
            }
        ))
    }, [dispatch, province, selected.province]);

    useEffect(() => {
        (city || selected.city) && dispatch(get(endpointResident + '/geo/city/' + (city || selected.city),

            res => {
                let formatted = res.data.data.map(el => ({ label: el.name, value: el.id }));
                setDistricts(formatted);
            }
        ))
    }, [city, dispatch, selected.city]);

    useEffect(() => {
        setBCLoading(true);
        dispatch(get(endpointResident + '/geo/province',

            res => {
                let formatted = res.data.data.map(el => ({ label: el.name, value: el.name }));
                console.log(formatted)

                setBCities(formatted);
                setBCLoading(false);
            }
        ))
    }, [dispatch]);

    

    useEffect(() => {
        dispatch(
          get(
            endpointAdmin +
              "/management/building" +
              "?limit=10&page=1" +
              "&search=",
            (res) => {
              let data = res.data.data.items;
    
              let formatted = data.map((el) => ({
                label: el.building_name,
                value: el.id,
              }));
    
              setBuildingList(formatted);
            }
          )
        );
      }, [dispatch, building]);

      useEffect(() => {
        dispatch(
          get(
            endpointAdmin +
            "/building/unit/v2" +
            "?page=1" +
            "&building_id=" +
            building +
            "&search=" +
            "&limit=999999999",
            (res) => {
                let data = res.data.data.items;
    
                let formatted = data.map((el) => ({
                  label: el.number,
                  value: el.id,
                }));

                setUnits(formatted);
              }
          )
        );
      }, [building, unit, dispatch]);

    return (
        <>
        <Modal
            isOpen={modalReason}
            toggle={() => { setModalReason(false) }}
            title="Release Billing"
            okLabel={"Yes, Submit"}
            onClick={() => {
            //   dispatch(post(endpointBilling+"/management/billing/publish-billing-building", {
            //     "building_id": '' +buildingRelease,
            //     "year": '' +year,
            //     "month": '' +month,
            //     "with_image": ''+withImage
            //   }, res => {
            //       console.log(res.data.data);
            //       dispatch(
            //         setInfo({
            //           color: "success",
            //           message: `${res.data.data} billing has been set to released.`,
            //         })
            //       );
            //       // resultComponent ? setOpenRes(true) : toggle();
            //   }, err => {
            //     dispatch(
            //       setInfo({
            //         color: "error",
            //         message: `Error to released.`,
            //       })
            //     );
            //     console.log("error");
            //   }))
  
              setModalReason(false)
          }}
        >
  
          <Input
              label="Choose Release Schedule"
              type="radio"
              name="release_type"
              options={[
                { value: "now", label: "Now" },
                { value: "othe", label: "Other" },
              ]}
            //   inputValue={type}
            //   setInputValue={setType}
          /> 
  
          {/* {type === "now" ? null :     */}
          <Input
              type="date"
              label="Schedule"
              name="publish_schedule"
          />
          {/* }   */}
  
          <Input
              label="Release with image from catat meter?"
              type="radio"
              name="with_image"
              options={[
                { value: "y", label: "Yes" },
                { value: "n", label: "No" },
              ]}
            //   inputValue={selectWithImage}
            //   setInputValue={setSelectWithImage}
          />  
  
        </Modal>
  
        <Template
            slice="resident"
            payload={state?.email ? {
                email: state.email,
            } : selected.id ? {
                ...residentPayload, ...selected,
                phone: selected.phone.slice(2),
                birthdate: selected.birthdate?.split('T')[0],
            } : residentPayload}
            schema={residentSchema}
            formatValues={values => ({
                ...values,
                phone: '62' + values.phone,
                birthdate: values.birthdate ? values.birthdate + ' 00:00:00' : null,
            })}
            edit={data => state?.email ? dispatch(createResident(data, history)) :
                dispatch(editResident(data, history, selected.id))}
            add={data => dispatch(createResident(data, history))}
            renderChild={props => {
                const { values, errors } = props;

                return (
                    <Form className="Form">
                        <Input {...props} label="Email" onFocus={() => setEmailRegistered(false)}
                            placeholder={"Input Resident Email"} type="email" compact />
                        <Input {...props} label="Phone" prefix="+62" onKeyPress={(event) => {
                            if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                            }
                        }} />
                        {exist && <button
                            type="button"
                            style={{ color: 'white' }}
                            onClick={() => {
                                dispatch(post(endpointResident + '/management/resident/check', {
                                    email: values.email,
                                    phone: values.phone
                                },
                                    res => {
                                        res.data.data.id
                                            ?
                                            setEmailRegistered(res.data.data.id)
                                            :
                                            setExist(false)
                                    },
                                ))
                            }}
                            disabled={!((values.phone) || (values.email))}
                        >
                            Check
                            </button>}
                        {emailRegistered &&
                            <>
                                <span style={{
                                    marginTop: 24,
                                    marginBottom: 12,
                                }}><b>Email</b> or <b>Phone Number</b> is already registered. Go to Resident details to add unit to this
                                    Resident?
                        </span>
                                <button type="button" style={{
                                    marginBottom: 16,
                                    color: 'white'
                                }} onClick={() => {
                                    console.log(emailRegistered);
                                    history.push(emailRegistered + '');
                                }}>Yes</button>
                            </>
                        }
                        {(!exist) && <>
                            <SectionSeparator />
                            <Input {...props} label="First Name" name="firstname" />
                            <Input {...props} label="Last Name" name="lastname" />
                            
                            <SectionSeparator />

                            <Input {...props} optional label="Nationality" options={countries}
                            />
                            <Input {...props} optional label="Birth Place" name="birthplace" options={bcities}
                                loading={bcloading}
                            />
                            <Input {...props} optional label="Birth Date" name="birthdate" type="date" />
                            <Input {...props} optional hidden name="nationality" />
                            <Input {...props} optional label="Gender" type="radio" options={[
                                { value: 'P', label: 'Female' },
                                { value: 'L', label: 'Male' },
                            ]} />
                            <Input {...props} optional label="Marital Status" options={[
                                { value: 'single', label: 'Single' },
                                { value: 'married', label: 'Married' },
                                { value: 'divorce', label: 'Divorced' },
                                { value: 'other', label: 'Other' },
                            ]} />
                            <Input {...props} optional label="Occupation" options={[
                                { value: 'unemployed', label: 'Unemployed' },
                                { value: 'student', label: 'Student' },
                                { value: 'university_student', label: 'University Student' },
                                { value: 'professional', label: 'Professional' },
                                { value: 'housewife', label: 'Housewife' },
                            ]} />
                            <SectionSeparator />

                            <Input {...props} optional label="Address" type="textarea" />
                            <Input {...props} optional label="Province" options={provinces}
                                onChange={el => setProvince(el.value)}
                            />
                            {values.province && <Input {...props} optional label="City" options={cities}
                                onChange={el => setCity(el.value)}
                            />}
                            {values.city && <Input {...props} optional label="District"
                                options={districts} />}
                            <SectionSeparator />

                            {role !== "bm" && <Input {...props} label="Building" options={buildingList}
                                onChange={el => {setBuilding(el.value)}}
                            />}

                            {building && <Input {...props} label="Unit" options={units}
                                onChange={el => { 
                                    setUnit(el.value)
                                }}
                            />}

                            <SectionSeparator />

                            <Input {...props} optional label="Account Bank" options={banks} />
                            <Input {...props} optional label="Account Number" name="account_no" />
                            <Input {...props} optional label="Account Name" />
                            {/* <SectionSeparator />

                            <Input {...props} required type="textarea" limit={120} label="Edit Reason" name="reason" /> */}

                            <SubmitButton loading={loading} errors={errors} />
                        </>}
                    </Form>
                )
            }}
        />
    </>
    )
}

export default Component;
