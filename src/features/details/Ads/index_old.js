import React, { useState, useEffect, useMemo } from "react";
import { useHistory, useRouteMatch, useParams } from "react-router-dom";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";

import Button from "../../../components/Button";
import Popover from "../../../components/Popover";
import Modal from "../../../components/Modal";
import Pill from "../../../components/Pill";
import {
  FiSearch,
  FiCopy,
  FiArrowUpCircle,
  FiBell,
  FiMessageSquare,
} from "react-icons/fi";
import { FaInfoCircle } from "react-icons/fa";

import Detail from "../components/Detail";
import Template from "../components/Template";

import Content from "./contents/Content";
import Schedule from "./contents/Schedule";
import Impression from "./contents/Impression";
import { get, setConfirmDelete } from "../../slice";
import { endpointAds } from "../../../settings";
import { dateTimeFormatter, toSentenceCase } from "../../../utils";
import { deleteAds, setSelected, publishAds } from "../../slices/ads";

function Component({ view }) {
  const [toggle, setToggle] = useState(false);
  const [modal, setModal] = useState(false);
  const [data, setData] = useState({});

  let dispatch = useDispatch();
  let history = useHistory();
  let { url } = useRouteMatch();
  let { id } = useParams();

  const { role, user } = useSelector((state) => state.auth);
  const { group } = user;

  const details = useMemo(() => {
    return {
      Information: [
        "id",
        { label: "appear_as", vfmt: (v) => <Pill color="success">{v}</Pill> },
        {
          label: "created_on",
          lfmt: () => "Created On",
          vfmt: (v) => dateTimeFormatter(v, "-"),
        },
        {
          label: "created_by",
          lfmt: () => "Created By",
          vfmt: (v) => (v > 0 ? data.bm_ad_building_name : "Centratama"),
        },
        {
          label: "modified_on",
          lfmt: () => "Last Modified",
          vfmt: (v) => dateTimeFormatter(v, "-"),
        },
        {
          label: "media",
          vfmt: (v) => (
            <>
              <span>{toSentenceCase(v)}</span>
              <Popover
                id={v}
                item={<FaInfoCircle />}
                title={"Information"}
                content={
                  v === "apps"
                    ? "Would appear in advertisement details page inside Apps when advertisement is clicked"
                    : "Would redirect to URL in a webview screen when advertisement is clicked"
                }
              />
            </>
          ),
        },
        "content_type",
        //{ disabled: data.content_type === 'video',
        //    label: 'content_image', vfmt: (v) => <a href={v}>{v}</a> },
        //{ disabled: data.content_type === 'image',
        //    label: 'content_video', vfmt: (v) => <a href={v}>{v}</a> },
      ],
      "Publish Information": [
        {
          label: "published",
          lfmt: () => "Status",
          vfmt: (v) =>
            v ? (
              moment().isBefore(moment(data.end_date.slice(0, -1))) ? (
                <Pill color="success">Published</Pill>
              ) : (
                <Pill color="danger">Ended</Pill>
              )
            ) : (
              <Pill color="secondary">Draft</Pill>
            ),
        },
        { label: "start_date", vfmt: (v) => dateTimeFormatter(v) },
        {
          label: "end_date",
          vfmt: (v) =>
            dateTimeFormatter(v) +
            " (" +
            moment(v.slice(0, -1)).fromNow() +
            ") ",
        },
      ],
      "Target Parameters": [
        {
          disabled: role !== "sa",
          label: "buildings",
          lfmt: () => "Target Building",
          vfmt: (v) => {
            if (!data.bm_ad_building_id) {
              return v && v.length > 0
                ? v.map((el) => <Pill color="primary">{el.name}</Pill>)
                : "All";
            } else {
              return <Pill color="primary">{data.bm_ad_building_name}</Pill>;
            }
          },
        },
        {
          label: "age_from",
          lfmt: () => "Target Age Range",
          vfmt: (v) => {
            return (
              v +
              " years old - " +
              data.age_to +
              " years old" +
              (v === 10 && data.age_to === 85 ? " (Default)" : "")
            );
          },
        },
        {
          label: "os",
          vfmt: (v) => (!v ? "Not Specified" : v),
          lfmt: () => "Target OS",
        },
        {
          label: "gender",
          lfmt: () => "Target Gender",
          vfmt: (v) => (!v ? "Not Specified" : v === "M" ? "Male" : "Female"),
        },
        {
          label: "occupation",
          lfmt: () => "Target Occupation",
          vfmt: (v) => (!v ? "Not Specified" : toSentenceCase(v)),
        },
        {
          label: "default_priority_score",
          lfmt: () => "Weight",
          vfmt: (v) => v,
        },
        {
          label: "total_priority_score",
          lfmt: () => "Total Weight",
          vfmt: (v) => v,
        },
      ],
      Statistics: [
        "total_actual_click",
        "total_actual_view",
        {
          label: "total_repeated_click",
          vfmt: (v) =>
            data.click_quota ? <>{v + " out of " + data.click_quota}</> : v,
        },
        {
          label: "total_repeated_view",
          vfmt: (v) =>
            data.view_quota ? <>{v + " out of " + data.view_quota}</> : v,
        },
      ],
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    dispatch(
      get(endpointAds + "/management/ads/" + id, (res) => {
        setData(res.data.data);
        dispatch(setSelected(res.data.data));
      })
    );
  }, [dispatch, id, toggle]);

  return (
    <>
      <Modal
        width={"720px"}
        isOpen={modal}
        disableFooter={true}
        toggle={() => setModal(false)}
        title="Preview"
        subtitle="How the advertisement would look on resident's home screen"
      >
        <div
          style={{
            width: "100%",
            height: "calc(614 / 1024 * 720px)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              height: "calc(164 / 1024 * 720px)",
              flex: 1,
              position: "absolute",
              right: 0,
              left: 0,
              zIndex: 99,
              backgroundColor: "#fafafaaa",
              fontWeight: "bold",
              display: "flex",
            }}
          >
            <img
              style={{
                height: "35px",
                top: "45px",
                left: "30px",
                position: "absolute",
              }}
              src={require("../../../assets/yipy-logo-color.png")}
              alt="clinklogo"
            />
            <FiMessageSquare
              size="45"
              style={{ top: "45px", position: "absolute", right: "140px" }}
            />
            <FiBell
              size="45"
              style={{ top: "45px", position: "absolute", right: "45px" }}
            />
          </div>
          <img
            style={{
              height: "100%",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              marginRight: "-50%",
            }}
            src={data.content_image}
            alt="content_image"
          />
        </div>
      </Modal>
      <Template
        loading={!data.id}
        pagetitle="Advertisement Information"
        labels={["Details", "Schedules", "Impression"]}
        contents={[
          <div style={{ display: "flex" }}>
            <div style={{ marginRight: "20px" }}>
              <Content />
            </div>
            <Detail
              editable={
                !(role === "sa" && data.bm_ad_building_id > 0) &&
                group != "vas_advertiser"
              }
              view={view}
              type="Advertisement"
              data={data}
              labels={details}
              onDelete={
                group === "vas_advertiser"
                  ? undefined
                  : () =>
                      dispatch(
                        setConfirmDelete(
                          "Are you sure to delete this item?",
                          () => dispatch(deleteAds(data, history))
                        )
                      )
              }
              renderButtons={() => [
                !(role === "sa" && data.bm_ad_building_id > 0) &&
                  group !== "vas_advertiser" && (
                    <Button
                      icon={<FiCopy />}
                      label="Duplicate"
                      onClick={() => {
                        dispatch(
                          setSelected({ ...data, duplicate: true, id: null })
                        );
                        history.push(
                          url.split("/").slice(0, -1).join("/") + "/add"
                        );
                      }}
                    />
                  ),
                <Button
                  icon={<FiSearch />}
                  label="Preview Banner"
                  disabled={data.appear_as === "popup"}
                  onClick={() => {
                    setModal(true);
                  }}
                />,
                group !== "vas_advertiser" && (
                  <Button
                    icon={<FiArrowUpCircle />}
                    disabled={!!data.published}
                    label={data.published ? "Published" : "Publish"}
                    onClick={() => {
                      dispatch(publishAds(data, () => setToggle(!toggle)));
                    }}
                  />
                ),
              ]}
            />
          </div>,
          <Schedule view={view} />,
          <Impression view={view} id={id} />,
        ]}
      />
    </>
  );
}

export default Component;