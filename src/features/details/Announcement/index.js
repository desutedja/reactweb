import React, { useCallback, useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useRouteMatch, useParams } from "react-router-dom";
import { dateTimeFormatter, toSentenceCase } from "../../../utils";

import { FiCopy, FiArrowUpCircle, FiTrash, FiImage } from "react-icons/fi";
import Detail from "../components/Detail";
import Modal from "../../../components/Modal";
import Loading from "../../../components/Loading";
import Button from "../../../components/Button";
import Pill from "../../../components/Pill";
import Template from "../components/Template";
import {
  deleteAnnouncement,
  publishAnnouncement,
  setSelected,
} from "../../slices/announcement";

import Content from "./contents/Content";
import Impression from "./contents/Impression";
import { get } from "../../slice";
import { endpointAdmin } from "../../../settings";

function Component({ view }) {
  const [data, setData] = useState({});

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [impression, setImpression] = useState(false);

  let dispatch = useDispatch();
  let history = useHistory();
  let { url } = useRouteMatch();
  let { id } = useParams();

  const { role } = useSelector((state) => state.auth);
  const { refreshToggle } = useSelector((state) => state.announcement);

  const publishCb = useCallback(() => {
    setPublishing(true);
    dispatch(publishAnnouncement(data, history, role));
  }, [data, history, role, dispatch]);

  useEffect(() => {
    dispatch(
      get(endpointAdmin + "/announcement/preview/" + id, (res) => {
        setData(res.data.data);
        dispatch(setSelected(res.data.data));
      })
    );
  }, [dispatch, refreshToggle, id]);

  const details = useMemo(
    () => ({
      Information: [
        "id",
        {
          label: "created_on",
          lfmt: () => "Created On",
          vfmt: (val) => (val ? dateTimeFormatter(val, "-") : "-"),
        },
        {
          label: "modified_on",
          lfmt: () => "Last Modified",
          vfmt: (val) => (val ? dateTimeFormatter(val, "-") : "-"),
        },
      ],
      Consumer: [
        { label: "consumer_role", vfmt: (val) => toSentenceCase(val) },
        {
          label: "building",
          disabled:
            data.consumer_role === "merchant" &&
            data.consumer_role === "centratama",
          lfmt: () => "Target Building",
          vfmt: (v) =>
            v && v.length > 0
              ? v.map((el) => <Pill color="primary">{el.building_name}</Pill>)
              : "All",
        },
        {
          label: "building_unit",
          disabled: data.consumer_role !== "resident",
          lfmt: () => "Target Unit",
          vfmt: (v) =>
            v && v.length > 0
              ? v.map((el) => (
                  <Pill color="primary">
                    {toSentenceCase(el.section_type) +
                      toSentenceCase(el.section_name) +
                      toSentenceCase(el.number)}
                  </Pill>
                ))
              : "All",
        },
        {
          label: "merchant",
          disabled: data.consumer_role !== "merchant",
          lfmt: () => "Target Merchant",
          vfmt: (v) =>
            v && v.length > 0
              ? v.map((el) => el.merchant_name).join(", ")
              : "All",
        },
      ],
      Publisher: [
        {
          label: "publish",
          lfmt: () => "Status",
          vfmt: (val) =>
            val === 0 ? (
              <Pill color="secondary">Draft</Pill>
            ) : (
              <Pill color="success">Published</Pill>
            ),
        },
        { label: "publisher", lfmt: () => "Publisher ID" },
        "publisher_name",
        {
          label: "publisher_role",
          vfmt: (v) => {
            if (v === "sa") return "Super Admin";
            else if (v === "bm") return "Building Management Admin";
            else return v;
          },
        },
      ],
    }),
    [data]
  );

  console.log(data);

  return (
    <>
      <Modal
        isOpen={confirmDelete}
        disableHeader={true}
        btnDanger
        onClick={() => dispatch(deleteAnnouncement(data, history))}
        toggle={() => setConfirmDelete(false)}
        okLabel={"Delete"}
        cancelLabel={"Cancel"}
      >
        Are you sure you want to delete this announcement?
      </Modal>
      <Modal
        width="700px"
        isOpen={impression}
        disableSecondary
        title="Announcement Impression"
        toggle={() => setImpression(false)}
        okLabel={"Close"}
        onClick={() => setImpression(false)}
      >
        <Impression data={data} />

        {/* {typeof data.impression != "undefined" &&
         
          data.impression.map((el) => {
            return <div>{el.resident_name}</div>;
          })} */}
      </Modal>
      <Template
        title={data.title}
        loading={!data.id}
        labels={["Details"]}
        contents={[
          <div style={{ display: "flex" }}>
            <div style={{ marginRight: "20px" }}>
              <Content />
            </div>
            <Detail
              view={view}
              type="Announcement"
              data={data}
              labels={details}
              editable={data.publish === 0}
              renderButtons={() => [
                <Loading size={10} loading={publishing && data.publish === 0}>
                  <Button
                    label="Publish"
                    icon={<FiArrowUpCircle />}
                    disabled={data.publish === 1}
                    onClick={publishCb}
                  />
                </Loading>,
                <Button
                  label="Preview"
                  icon={<FiImage />}
                  onClick={() => {
                    history.push(url + "/view");
                  }}
                />,
                <Button
                  label="Impression"
                  icon={<FiImage />}
                  onClick={() => {
                    setImpression(true);
                  }}
                />,
                <Button
                  label="Duplicate"
                  icon={<FiCopy />}
                  onClick={() => {
                    history.push({
                      pathname: url.split("/").slice(0, -1).join("/") + "/add",
                    });
                    dispatch(setSelected({ ...data, duplicate: true }));
                  }}
                />,
                <Button
                  color="Danger"
                  icon={<FiTrash />}
                  label="Delete"
                  onClick={() => setConfirmDelete(true)}
                />,
              ]}
            />
          </div>,
        ]}
      />
    </>
  );
}

export default Component;
