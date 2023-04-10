import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import DetailFacility from "../../components/DetailFacility";
import Schedule from "./contents/Schedule";
import TemplateFacilities from "../../components/TemplateFacilities";
import Modal from "../../../../components/Modal";
import { useHistory, useParams } from "react-router-dom";
import { get } from "../../../slice";
import { endpointBookingFacility, endpointMerchant } from "../../../../settings";
import { setSelected } from "../../../slices/facility";
import { toMoney } from "../../../../utils";

const info = {
  Information: ["id", "created_date", "name", "status", "check_in_start_minute"],
  "Other Facilities": ["open_at", "closed_at"],
  Location: ["location"],
  Description: ["description"],
  Rules: ["rules"],
};

function Component({ view, canDelete, canUpdate }) {
  const [data, setData] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { role } = useSelector((state) => state.auth);

  let dispatch = useDispatch();
  let history = useHistory();
  let { id } = useParams();

  useEffect(() => {
    dispatch(
      get(endpointBookingFacility + "/admin/facilities/" + id, (res) => {
        // res.data.data.free_deliv = res.data.data.free_deliv.toString();
        console.log("get data list facilities")
        setData(res.data);
        dispatch(setSelected(res.data));
      })
    );
  }, [id, dispatch]);

  return (
    <>
      {/* <Modal
        isOpen={confirmDelete}
        btnDanger
        disableHeader={true}
        onClick={() => dispatch(deleteMerchant(data, history))}
        toggle={() => setConfirmDelete(false)}
        okLabel={"Delete"}
        cancelLabel={"Cancel"}
      >
        Are you sure you want to delete merchant <b>{data.name}</b>?
      </Modal> */}
      <TemplateFacilities
        loading={!data.id}
        thumbnail={data.thumbnail_url || "placeholder"}
        images={data.image_urls}
        title={data.name}
        phone={data.phone}
        pagetitle="Facility Information"
        labels={["Details", "Operational Hour"]}
        contents={[
          <DetailFacility
            view={view}
            data={data}
            labels={info}
            editable={canUpdate}
            onDelete={() => {
              if (role === "bm") {
                if (canDelete) {
                  return setConfirmDelete(true);
                } else {
                  return undefined;
                }
              }
              return setConfirmDelete(true);
            }}
          />,
          <Schedule 
            view={view} 
            schedule={data.open_schedules}
          />,
        ]}
      />
    </>
  );
}

export default Component;
