import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import DetailPackage from "../components/DetailPackage";
import TemplateInternetPackage from "../components/TemplateInternetPackage";

import { useParams, useHistory } from "react-router-dom";
import { get, setConfirmDelete } from "../../slice";
import Pill from "../../../components/Pill";
import Table from "../../../components/Table";
import {
  dateTimeFormatter,
  toSentenceCase,
  staffRoleFormatter,
  setModuleAccess,
} from "../../../utils";
import { endpointManagement } from "../../../settings";
import { deleteStaff, setSelected } from "../../slices/staff";
import { setAccess } from "../../auth/slice";

function Component({ view, canUpdate, canDelete }) {
  const { auth } = useSelector((state) => state);
  const [data, setData] = useState({});

  let dispatch = useDispatch();
  let { id } = useParams();
  let history = useHistory();

  const details = useMemo(() => {
    return {
      "": ["address", "district_name", "city_name", "province_name",
          "management_name", "staff_role"],
    };
  }, [data]);

  useEffect(() => {
    dispatch(
      get(endpointManagement + "/admin/staff/" + id, (res) => {
        setData(res.data.data);
        dispatch(setSelected(res.data.data));
        if (auth.user.id === res.data.data.id) {
          const { active_module_detail } = res.data.data;
          let access = setModuleAccess(active_module_detail);
          dispatch(setAccess(access));
        }
      })
    );
  }, [dispatch, id]);

  return (
    <TemplateInternetPackage
      loading={!data.id}
      labels={["Details"]}
      contents={[
        <>
          <DetailPackage
            view={view}
            data={data}
            labels={details}
          />
        </>,
      ]}
    />
  );
}

export default Component;
