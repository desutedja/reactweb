import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import Detail from "../components/Detail";
import Template from "../components/Template";
import Modal from "../../../components/Modal";
import { useHistory, useParams } from "react-router-dom";
import { get } from "../../slice";
import { endpointMerchant } from "../../../settings";
import { setSelected, deleteMerchant } from "../../slices/merchant";
import { toMoney } from "../../../utils";

const info = {
  Information: [
    "id",
    "name",
    "description",
    "created_on",
    "type",
    "legal",
    "category",
    {
      label: "building_list",
      vfmt: (v) => {
        return v.map((el, i) => el.name + (i === v.length - 1 ? "" : ", "));
      },
    },
    "address",
    "district_name",
    "city_name",
    "province_name",
    "lat",
    "long",
    {
      label: "free_deliv",
      lfmt: (v) => "Next Day Delivery",
      vfmt: (v) => {
        return parseInt(v) === 1 ? "Yes" : "No";
      },
    },
    {
      label: "free_deliv_min",
      lfmt: (v) => "Next Day Delivery Min ",
      vfmt: (v) => {
        if (v === 0) return "-";
        return toMoney(v);
      },
    },
    {
      label: "courier_fee",
      vfmt: (v) => {
        if (v === 0) return "-";
        return toMoney(v);
      },
    },
    "open_at",
    "closed_at",
    "status",
    "status_updated",
  ],
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
      <Template
        image={data.logo || "placeholder"}
        title={data.name}
        phone={data.phone}
        loading={!data.id}
        labels={["Details", "Contact Person", "Bank Account"]}
        contents={[
          <Detail
            view={view}
            data={data}
            labels={info}
            onDelete={() => setConfirmDelete(true)}
          />,
          <Detail view={view} data={data} labels={pic} />,
          <Detail view={view} data={data} labels={account} />,
        ]}
      />
    </>
  );
}

export default Component;
