import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import DetailFacility from "../../components/DetailFacility";
import Schedule from "./contents/Schedule";
import TemplateFacilities from "../../components/TemplateFacilities";
import Modal from "../../../../components/Modal";
import { useHistory, useParams } from "react-router-dom";
import { get } from "../../../slice";
import { endpointMerchant } from "../../../../settings";
import { setSelected, deleteMerchant } from "../../../slices/merchant";
import { toMoney } from "../../../../utils";

const info = {
  Information: ["id", "created_on", "name", "type", "legal"],
  "Other Facilities": ["open_at", "closed_at"],
  Description: ["description"],
  "More Info": ["district", "city"],
};

function Component({ view, canDelete }) {
  const [data, setData] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { role } = useSelector((state) => state.auth);

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
      <TemplateFacilities
        loading={!data.id}
        image={data.logo || "placeholder"}
        title={data.name}
        phone={data.phone}
        pagetitle="Facility Information"
        labels={["Details", "Operational Hour"]}
        contents={[
          <DetailFacility
            view={view}
            data={data}
            labels={info}
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
          <Schedule view={view} />,
        ]}
      />
    </>
  );
}

export default Component;
