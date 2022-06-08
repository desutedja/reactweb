import React, { useEffect, useCallback, useState } from "react";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { FiX, FiSearch, FiPlus, FiEdit } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";

import Button from "../../../../components/Button";
import TableInternet from "../../../../components/TableInternet";
import Modal from "../../../../components/Modal";
import Input from "../../../../components/Input";
import Filter from "../../../../components/Filter";
import { toSentenceCase, removeLastFromPath, dateFormatter } from "../../../../utils";
import SectionSeparator from "../../../../components/SectionSeparator";
import Resident from "../../../../components/cells/Resident";

import {
  getResidentUnit,
  addResidentUnit,
  deleteSubaccount,
  deleteUnit,
  refresh,
} from "../../../slices/resident";
import { get, post, setConfirmDelete } from "../../../slice";
import Loading from "../../../../components/Loading";
import { RiCalendarEventLine } from "react-icons/ri";
import { dateTimeFormatter } from "../../../../utils";
import Breadcrumb from "../../../../components/Breadcrumb";
import InternetPackage from "../../../../components/cells/InternetPackage";
import { endpointAdmin, endpointInternet, endpointResident } from "../../../../settings";
import { setSelected } from "../../../slices/internet";
import Avatar from "react-avatar";

function Component({ view, canAdd, canUpdate, canDelete, editPath = 'edit', addPath = 'package/add' }) {
  const [addUnit, setAddUnit] = useState(false);
  const [delUnit, setDelUnit] = useState({
    delete: [],
  });
  // const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmDeleteUnit, setConfirmDeleteUnit] = useState(false);
  const [addUnitStep, setAddUnitStep] = useState(1);

  const [data, setData] = useState({ items: [] });

  const [addSubAccount, setAddSubAccount] = useState(false);
  const [addSubAccountStep, setAddSubAccountStep] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [residents, setResidents] = useState([]);
  const [subAccount, setSubAccount] = useState({});
  const [ownershipStatus, setOwnershipStatus] = useState("");

  const [mainOwner, setMainOwner] = useState();

  const [search, setSearch] = useState("");

  const [selectedBuilding, setSelectedBuilding] = useState({});
  const [buildings, setBuildings] = useState([]);

  const [selectedUnit, setSelectedUnit] = useState("");
  const [units, setUnits] = useState([]);

  const [
    level,
    // setLevel
  ] = useState("main");
  const [status, setStatus] = useState("own");
  const [periodFrom, setPeriodFrom] = useState("");
  const [periodTo, setPeriodTo] = useState("");

  const { unit, loading, refreshToggle } = useSelector(
    (state) => state.resident
  );
  const { selected } = useSelector((state) => state.building);
  const { role } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [checking, setChecking] = useState("");
  const [found, setFound] = useState(true);

  let dispatch = useDispatch();
  let history = useHistory();
  let { id } = useParams();
  let { path, url } = useRouteMatch();

  useEffect(() => {
    dispatch(
      get(endpointInternet + "/admin/providerdetail?provider_id=" + id, (res) => {
        setData(res.data.data);
        dispatch(setSelected(res.data.data));
      })
    );
  }, [dispatch, id]);

  return (
    <>
      <div
        className="Container"
        style={{
          flex: "none",
          height: "200",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
          }}
        >
              <table>
                <tr>
                  <td colSpan={5}>
                    <b>Provider Details</b>
                  </td>
                  <td>
                    <div className="row no-gutters w-100" style={{ justifyContent: 'space-between' }}>
                        <div className="col-12 col-md-5 col-lg-3 mb-4 mb-md-0 mr-4">
                            
                        </div>
                        <div className="col-auto d-flex flex-column">
                            <Button icon={<FiEdit />} label="Edit" onClick={() => history.push({
                                pathname: editPath,
                                // state: data,
                            })} />
                        </div>
                    </div>
                  </td>
                </tr>
                <tr style={{ textAlign: "center"}}>
                  <td style={{borderBottom: "0px solid #ffffff"}}>
                    <b></b>
                  </td>
                  <td style={{borderBottom: "0px solid #ffffff"}}>
                    <b>Provider Name</b>
                  </td>
                  <td style={{borderBottom: "0px solid #ffffff"}}>
                    <b>PIC</b>
                  </td>
                  <td style={{borderBottom: "0px solid #ffffff"}}>
                    <b>Email</b>
                  </td>
                  <td style={{borderBottom: "0px solid #ffffff"}}>
                    <b>Phone</b>
                  </td>
                  <td style={{borderBottom: "0px solid #ffffff"}}>
                    <b>Created On</b>
                  </td>
                </tr>
                <tr style={{ textAlign: "center"}}>
                  <td style={{borderBottom: "0px solid #ffffff"}}>          
                    <Avatar
                      className="Item-avatar"
                      size="40"
                      src={data.image}
                      name='L O G O'
                    />
                  </td>
                  <td style={{borderBottom: "0px solid #ffffff"}}>
                    {toSentenceCase(data.provider_name)}
                  </td>
                  <td style={{borderBottom: "0px solid #ffffff"}}>
                    {toSentenceCase(data.pic_name)}
                  </td>
                  <td style={{borderBottom: "0px solid #ffffff"}}>
                    {data.pic_email}
                  </td>
                  <td style={{borderBottom: "0px solid #ffffff"}}>
                    {"62" + data.pic_phone}
                  </td>
                  <td style={{borderBottom: "0px solid #ffffff"}}>
                    {dateTimeFormatter(data.created_on)}
                  </td>
                </tr>
              </table>
            </div>
      </div>
    </>
  );
}

export default Component;
