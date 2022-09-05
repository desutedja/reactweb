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
import { endpointInternet, endpointManagement } from "../../../settings";
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
      "": [
        "package_name",
        "speed",
        "price",
        "coverage_area",
        "notes",
        "tv_channel",
      ],
    };
  }, [data]);

  useEffect(() => {
    dispatch(
      get(endpointInternet + "/admin/packagedetail?package_id=" + id, (res) => {
        setData(res.data.data);
      })
    );
  }, [dispatch, id]);

  return (
    <TemplateInternetPackage
      loading={!data.id}
      title={data.package_name}
      pagetitle="Package Information"
      labels={["Details"]}
      contents={[
        <>
          <DetailPackage view={view} data={data} labels={details} />
        </>,
      ]}
    />
  );
}

export default Component;
