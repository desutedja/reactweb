import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import DetailPushNotif from "../components/DetailPushNotif";
import TemplateBooking from "../components/TemplateBooking";
import Modal from "../../../components/Modal";
import { useHistory, useParams } from "react-router-dom";
import { get } from "../../slice";
import { endpointMerchant } from "../../../settings";
import { setSelected, deleteMerchant } from "../../slices/merchant";

const info = {
  Information: ["id", "created_on", "status", "title", "caption"],
  Filters: ["age_from", "building_name", "gender", "billing"],
  Schedule: ["scheduling_option", "delivery_schedule", "send_on", "close_at"],
};

function Component({ view }) {
  const [data, setData] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(false);

  let dispatch = useDispatch();
  let history = useHistory();
  let { id } = useParams();

  useEffect(() => {
    dispatch(
      get("https://demo9353390.mockable.io/pushNotif%3Fid=" + id, (res) => {
        // get(endpointMerchant + "/admin?id=" + id, (res) => {
        setData(res.data.data);
        dispatch(setSelected(res.data.data));
      })
    );
  }, [id, dispatch]);

  return (
    <>
      <TemplateBooking
        loading={!data.id}
        image={data.image || "placeholder"}
        link={data.link}
        pagetitle="Push Notif Information"
        contents={[<DetailPushNotif view={view} data={data} labels={info} />]}
      />
    </>
  );
}

export default Component;
