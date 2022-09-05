import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import DetailBooking from "../../components/DetailBooking";
// import Products from "./contents/Products";
import TemplateBooking from "../../components/TemplateBooking";
import Modal from "../../../../components/Modal";
import { useHistory, useParams } from "react-router-dom";
import { get } from "../../../slice";
import { endpointMerchant } from "../../../../settings";
import { setSelected, deleteMerchant } from "../../../slices/merchant";
import { toMoney } from "../../../../utils";

const info = {
  "Booking Details": ["id", "created_on"],
  "Resident Information": ["name", "type", "legal"],
  "Schedule Information": ["open_at", "closed_at"],
};

const pic = {
  Information: ["pic_name", "pic_phone", "pic_mail"],
};

const account = {
  Information: ["account_bank", "account_no", "account_name"],
};

function Component({ view }) {
  const [data, setData] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(false);

  let dispatch = useDispatch();
  let history = useHistory();
  let { id } = useParams();

  useEffect(() => {
    dispatch(
      get(endpointMerchant + "/admin?id=" + id, (res) => {
        res.data.data.free_deliv = res.data.data.free_deliv.toString();
        setData(res.data.data);
        dispatch(setSelected(res.data.data));
      })
    );
  }, [id, dispatch]);

  return (
    <>
      <Modal
        isOpen={confirmDelete}
        btnDanger
        disableHeader={true}
        onClick={() => dispatch(deleteMerchant(data, history))}
        toggle={() => setConfirmDelete(false)}
        okLabel={"Delete"}
        cancelLabel={"Cancel"}
      >
        Are you sure you want to delete merchant <b>{data.name}</b>?
      </Modal>
      <TemplateBooking
        loading={!data.id}
        image={data.logo || "placeholder"}
        title={data.name}
        pagetitle="Booking Information"
        phone={data.phone}
        contents={[<DetailBooking view={view} data={data} labels={info} />]}
      />
    </>
  );
}

export default Component;
