import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Detail from "../components/Detail";
import Template from "../components/Template";
import TemplateResident from "../components/TemplateResident";

import Modal from "../../../components/Modal";
import Pill from "../../../components/Pill";

import Unit from "./contents/Unit";
import Membership from "./contents/Membership";
import { useParams, useHistory } from "react-router-dom";
import {
  dateFormatter,
  toSentenceCase,
  ageFromBirthdate,
} from "../../../utils";
import { get } from "../../slice";
import { endpointResident, kyccolor } from "../../../settings";
import { deleteResident, setSelected } from "../../slices/resident";

const details = {
  Profile: [
    "created_on",
    "gender",
    "birthplace",
    {
      label: "birthdate",
      lfmt: () => "Birthdate",
      vfmt: (v) => {
        return (
          <>
            {dateFormatter(v)}{" "}
            {v && <span>({ageFromBirthdate(v)} years old)</span>}
          </>
        );
      },
    },
    "nationality",
    "marital_status",
    {
      label: "status_kyc",
      vfmt: (v) => (
        <Pill color={kyccolor[v]}>{v ? toSentenceCase(v) : "None"}</Pill>
      ),
    },
    "occupation",
  ],
  Address: ["address", "district_name", "city_name", "province_name"],
  "Bank Account": ["account_name", "account_no", "account_bank"],
};

function Component({ view, canAdd, canUpdate, canDelete }) {
  const [data, setData] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { role } = useSelector((state) => state.auth);

  let dispatch = useDispatch();
  let { id } = useParams();
  let history = useHistory();

  useEffect(() => {
    dispatch(
      get(endpointResident + "/management/resident/detail/" + id, (res) => {
        setData(res.data.data);
        dispatch(setSelected(res.data.data));
      })
    );
  }, [dispatch, id]);

  console.log(role, canDelete);
  return (
    <>
      <Modal
        isOpen={confirmDelete}
        btnDanger
        disableHeader={true}
        onClick={() => dispatch(deleteResident(data, history))}
        toggle={() => setConfirmDelete(false)}
        okLabel={"Delete"}
        cancelLabel={"Cancel"}
      >
        Are you sure you want to delete resident{" "}
        <b>{data.firstname + " " + data.lastname}</b>?
      </Modal>
      <TemplateResident
        image={data.photo || "placeholder"}
        title={data.firstname + " " + data.lastname}
        pagetitle="Resident Information"
        email={data.email}
        phone={data.phone}
        reason={data.update_reason}
        loading={!data.id}
        labels={["Details", "Unit", "Membership"]}
        activeTab={0}
        contents={[
          <Detail
            editable={canUpdate}
            view={view}
            data={data}
            labels={details}
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
          <Unit
            canAdd={role === "bm" ? canAdd : true}
            canDelete={role === "bm" ? canDelete : true}
            canUpdate={role === "bm" ? canUpdate : true}
            view={view}
            id={id}
          />,

          <Membership
            canAdd={role === "bm" ? canAdd : true}
            canDelete={role === "bm" ? canDelete : true}
            canUpdate={role === "bm" ? canUpdate : true}
            view={view}
            id={id}
          />,
        ]}
      />
    </>
  );
}

export default Component;
