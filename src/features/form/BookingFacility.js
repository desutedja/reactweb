import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import SectionSeparator from "../../components/SectionSeparator";
import { get, post } from "../slice";
import { endpointAdmin, endpointBookingFacility } from "../../settings";
import Modal from "../../components/Modal";

import Template from "./components/TemplateWithFormikBook";
import { Form, FieldArray, Field } from "formik";
import { facilitySchema } from "./services/schemas";
import Input from "./inputBooking";
import SubmitButton from "./components/SubmitButton";
import { createFacility, editFacility } from "../slices/facility";

import FileInput2 from "./inputBooking/File2";

const facilityData = {
  building_id:"",
  thumbnail_url:"",
  image_urls:[],
  name:"",
  location:"",
  description:"",
  check_in_start_minute:0,
  open_time:"",
  close_time:"",
  other_facilities:[],
  rules:[],
  open_schedules:[
    {
      day: "Sunday",
      open_time: "00:00",
      close_time: "00:00",
      duration:0,
      quota_per_duration:0,
    },
    {
      day: "Monday",
      open_time: "00:00",
      close_time: "00:00",
      duration:0,
      quota_per_duration:0,
    },
    {
      day: "Tuesday",
      open_time: "00:00",
      close_time: "00:00",
      duration:0,
      quota_per_duration:0,
    },
    {
      day: "Wednesday",
      open_time: "00:00",
      close_time: "00:00",
      duration:0,
      quota_per_duration:0,
    },
    {
      day: "Thursday",
      open_time: "00:00",
      close_time: "00:00",
      duration:0,
      quota_per_duration:0,
    },
    {
      day: "Friday",
      open_time: "00:00",
      close_time: "00:00",
      duration:0,
      quota_per_duration:0,
    },
    {
      day: "Saturday",
      open_time: "00:00",
      close_time: "00:00",
      duration:0,
      quota_per_duration:0,
    },
  ],
};



function Component() {
  const { selected, loading } = useSelector((state) => state.facility);
  const { role,user } = useSelector((state) => state.auth);

  const { auth } = useSelector((state) => state);

  const [buildings, setBuildings] = useState([]);

  let dispatch = useDispatch();
  let history = useHistory();

  const [otherFacility, setOtherFacility] = useState(facilityData.other_facilities);
  const [schedules, setSchedules] = useState(facilityData.open_schedules);
  const [imageList, setImageList] = useState(facilityData.image_urls);
  const [ruleList, setRuleList] = useState(facilityData.rules);
  const [edit, setEdit] = useState(false);
  const [editing, setEditing] = useState("");

  const [rules, setRules] = useState(facilityData.rules);

  const addRules = () => {
    let val = document.getElementById("rule").value
      if (val == "") {
        return
      }
      document.getElementById("rule").value='';
      setRuleList([...ruleList, val]);
  }

  const removeRules = (item) => {
    const index = ruleList.indexOf(item);
    if (index > -1) { // only splice array when item is found
      ruleList.splice(index, 1); // 2nd parameter means remove one item only
    }

    setRuleList([...ruleList]);
  }

  const editRules = (item,i) => {
    console.log("ITEM ", item, " - INDEX ", i)
    let dt = rules[i]
    setEditing(dt)
  }

  const editRule = (i) => {
    let val = document.getElementById("rules_edit").value
    const newState = rules.map(obj => {
      // 👇️ if id equals 2, update country property
      if (obj.id === i) {
        return {...obj, rule: val};
      }

      // 👇️ otherwise return the object as is
      return obj;
    });

    const ruless = newState.map((el) => (
      el.rule
    ));

    setRules(newState);
    setRuleList(ruless)
    setEdit(false);
  }

  const addOtherFacility = () => {
    var checkboxes = document.querySelectorAll('input[type=checkbox]:checked')

    otherFacility.splice(0, otherFacility.length);

    for (var i = 0; i < checkboxes.length; i++) {
      otherFacility.push(checkboxes[i].value)
    }

    setOtherFacility([...otherFacility])
  }

  const addImages = () => {
    let val = document.getElementById("image_facility").value
      if (val == "") {
        return
      }
      
      document.getElementById("image_facility").value='';
      
      setImageList([...imageList, val]);
  }

  const removeImages = (item) => {
    const index = imageList.indexOf(item);
    if (index > -1) { // only splice array when item is found
      imageList.splice(index, 1); // 2nd parameter means remove one item only
    }

    setImageList([...imageList]);
  }

  useEffect(() => {
    dispatch(
      get(
        endpointAdmin +
          "/management/building" +
          "?limit=10&page=1" +
          "&search=",
        (res) => {
          let buildings = res.data.data.items;

          let formatted = buildings.map((el) => ({
            label: el.building_name + " by " + el.management_name,
            value: el.id.toString(),
          }));

          setBuildings(formatted);
        }
      )
    );
  }, [dispatch]);

  useEffect(()=>{
		if(selected.id !== undefined){
      if (history.location.state.rules.length > 0){
        const ruless = history.location.state.rules.map((el) => (
          el.rule
        ));

        setRules(history.location.state.rules)
        setRuleList(ruless)
      }

      if (selected.image_urls.length > 0){
        const images = selected.image_urls.map((el) => (
          el.url
        ));

        setImageList(images)
      }


      selected.open_schedules.map((el, i) => (
        facilityData.open_schedules[i].day = el.day,
        facilityData.open_schedules[i].open_time = el.open_time,
        facilityData.open_schedules[i].close_time = el.close_time,
        facilityData.open_schedules[i].duration = el.duration,
        facilityData.open_schedules[i].quota_per_duration = el.quota_per_duration
      ));
    }
    //setSchedules(facilityData.open_schedules)
    // console.log("SCHEDULE: ", schedules)
	}, [])

  return (
    <div>
      <Modal title={"Edit Rules"} isOpen={edit} disableFooter={true} toggle={() => setEdit(false)}>
        
        <div className="Input">
              <div>
                <div >
                  <div>
                    <label className="Input-label" for="Rule">Rule</label>
                  </div>
                </div>
              </div>
              <div className="Input-containers">
                <input name="rules_edit" rows="4" placeholder="Rules" autocomplete="off" type="text" id="rules_edit" defaultValue={editing.rule} />
              </div>
              <br/>
              <button type="button" onClick={() => editRule(editing.id)}>submit</button>
            </div>
        
      </Modal>
    
    <Template
      slice="facility"
      payload={
        selected.id
          ? {
              ...facilityData,
              ...selected
            } 
          : facilityData
      }
      // schema={facilitySchema}
      formatValues={(values) => {
        const { ...facilityData } = values;
        return facilityData
      }}
      edit={(data) => {
        delete data[undefined];
        data.rules = rules
        data.building_id= data.building_id.toString();
        console.log("DATA EDIT: ", data);
        dispatch(editFacility(data, history, selected.id));
      }}
      add={(data) => {
        data.rules = ruleList;
        data.other_facilities = otherFacility;
        data.image_urls= imageList;
        if (auth.role === "bm") {
          data.building_id=user.building_id;
          delete data[undefined];
          console.log(data);
          dispatch(createFacility(data, history));
          return;
        }
        delete data[undefined];
        console.log(data);
        dispatch(createFacility(data, history));
        ;
      }}
      renderChild={(props) => {
        const {values, errors, setFieldValue } = props;
        console.log("PROPS", props);
        console.log("RuleList", ruleList);
        return (
          <Form className="Form">
             {role === "sa" && (
              <Input
                {...props}
                label="Building"
                name="building_id"
                options={buildings}
                autoComplete="off"
              />
            )}
              
            
            <Input {...props} label="Facility Name" name="name" />
            <Input
              {...props}
              label="Thumbnail Facility"
              name="thumbnail_url"
              type="file"
              accept="image/*"
            />

            <div className="Input">
              <div >
                <div>
                  <div><label className="Input-label" for="Image Facility">Image Facility</label></div>
                </div>
              </div>
              <FileInput2 name={"image_facility"} id="image_facility" placeholder="Image Facility" onClick={addImages} {...props} />
            </div>
            <ul>
            {imageList.map((item) => (
              <li>
                <span>{item}</span>
                {props.values.id == undefined ? (<button type="button" onClick={()=>{removeImages(item)}}>delete</button>) : ""}
              </li>
            ))}
          </ul>
            

            <Input
              {...props}
              label="Location"
              name="location"
              type="textarea"
            />

            <Input {...props} label="Check In Start Minute" name="check_in_start_minute" type="number" placeholder="check_in_start_minute (must number)" />
            <Input {...props} label="Open Time" name="open_time" type="text" placeholder="00:00" />
            <Input {...props} label="Close Time" name="close_time" type="text" placeholder="21:21" />
            <Input
              {...props}
              label="Description"
              name="description"
              type="textarea"
            />
            <div className="Input">
              <div>
                <div >
                  <div>
                    <label className="Input-label" for="Rule">Rule</label>
                  </div>
                </div>
              </div>
              <div className="Input-containers">
                <input name="rules" rows="4" placeholder="Rules" autocomplete="off" type="text" id="rule" />
                {props.values.id == undefined ? (<button type="button" onClick={addRules}>ADD</button>) : ""}
              </div>
            </div>
            
            <ul>
            {ruleList.map((item, i) => (
              <li>
                <span>{item}</span>
                {props.values.id == undefined ? (<button type="button" onClick={()=>{removeRules(item)}}>delete</button>) : (<button type="button" onClick={()=>{setEdit(true);editRules(values,i)}}>edit</button>)}
              </li>
            ))}
          </ul>
            <div className="row"
              style={{
                width: "100%",
                maxWidth: "calc(100% / 1.7 - 16px)",
                minWidth: "calc(100% / 1.7 - 16px)",
                height: "32px",
                marginTop: "24px",
                textAlign: "left",
              }}
            >
              <h5>Other Facilities</h5>
            </div>
            <div className="row">
              <div className="col"
              style={{minWidth: 240}}
              >
                {/* <Input 
                  {...props}
                  name="other_facilities"
                  type="checkbox"
                  options={[
                    {value: "toilet", label: "Toilet"},
                  ]}
                /> */}
                <input type="checkbox" id="facility1" name="other_facility" value="toilet" onChange={addOtherFacility} />
                <label for="facility1">Toilet</label><br></br>
                
              </div>
              <div className="col"
              style={{minWidth: 240}}>
                {/* <Input 
                  {...props}
                  name="other_facilities"
                  type="checkbox"
                  options={[
                    {value: "wifi", label: "Wifi"},
                  ]}
                /> */}
                <input type="checkbox" id="facility2" name="other_facility" value="wifi" onChange={addOtherFacility} />
                <label for="facility2">Wifi</label><br></br>
                
              </div>
              <div className="col"
              style={{minWidth: 240}}>
                {/* <Input 
                  {...props}
                  name="other_facilities"
                  type="checkbox"
                  options={[
                    {value: "towel", label: "Towel"},
                  ]}
                /> */}
                <input type="checkbox" id="facility3" name="other_facility" value="towel" onChange={addOtherFacility} />
                <label for="facility3">Towel</label><br></br>
                
              </div>
            </div>
              <>
                <SectionSeparator title="Operational Hour" />
                <FieldArray
                  name="schedules"
                  render={() => (
                    <div
                      className="Input"
                      style={{
                        maxWidth: 600,
                      }}
                    >
                      {values.open_schedules.map((friend, index) => (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: 8,
                          }}
                        >
                          <p
                            style={{
                              marginRight: 16,
                              flex: 1,
                            }}
                          >
                            {values.open_schedules[index].day}:{" "}
                          </p>
                          <Field
                            name={`open_schedules.${index}.open_time`}
                            type="time"
                            step="1"
                          />
                          <p
                            style={{
                              marginLeft: 16,
                              marginRight: 16,
                              textAlign: "center",
                            }}
                          >
                            -
                          </p>
                          <Field
                            name={`open_schedules.${index}.close_time`}
                            type="time"
                            step="1"
                          />
                          <p
                            style={{
                              marginLeft: 16,
                              marginRight: 16,
                              textAlign: "center",
                            }}
                          >
                          </p>
                          <input name={`open_schedules.${index}.duration`} type="text" placeholder="duration (hour)" defaultValue={friend.duration != 0 ? friend.duration : "" }
                          onChange={(duration)=> {
                            setFieldValue(
                              `open_schedules.${index}.duration`,
                              parseInt(duration.target.value)
                            )
                          }
                          } />
                          <p
                            style={{
                              marginLeft: 16,
                              marginRight: 16,
                              textAlign: "center",
                            }}
                          >
                          </p>
                          <input name={`open_schedules.${index}.quota_per_duration`} type="text" placeholder="quota" defaultValue={friend.quota_per_duration != 0 ? friend.quota_per_duration : "" }
                          onChange={(quota)=> {
                              setFieldValue(
                                `open_schedules.${index}.quota_per_duration`,
                                parseInt(quota.target.value)
                              )
                            }
                          }
                          />
                          
                          <button
                            type="button"
                            style={{
                              marginLeft: 16,
                              color: 'white'
                            }}
                            onClick={() => {
                              setFieldValue(
                                `open_schedules.${index}.open_time`,
                                "00:00"
                              );
                              setFieldValue(
                                `open_schedules.${index}.close_time`,
                                "23:59"
                              );
                            }}
                          >
                            Set All Day
                          </button>
                          <button
                            type="button"
                            style={{
                              marginLeft: 16,
                              color: 'white'
                            }}
                            onClick={() => {
                              setFieldValue(
                                `open_schedules.${index}.open_time`,
                                "00:00"
                              );
                              setFieldValue(
                                `open_schedules.${index}.close_time`,
                                "00:00"
                              );
                            }}
                          >
                            Set None
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                />
              </>
            
            <SubmitButton loading={loading} errors={errors} />
          </Form>
        );
      }}
    />
    </div>
  );
}

export default Component;
