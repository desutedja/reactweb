import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import parser from "html-react-parser";

import { get } from "../../slice";
import { endpointAdmin } from "../../../settings";

function View() {
  const [data, setData] = useState({});
  const [imgLoading, setImgLoading] = useState(true);

  let dispatch = useDispatch();
  let { id } = useParams();

  const { refreshToggle } = useSelector((state) => state.announcement);

  useEffect(() => {
    dispatch(
      get(endpointAdmin + "/announcement/preview/" + id, (res) => {
        setData(res.data.data);
      })
    );
  }, [dispatch, refreshToggle, id]);

  return (
    <div className="Container" style={{ paddingRight: 8 }}>
      <div
        style={{
          flexDirection: "column",
          overflow: "auto",
          paddingRight: 16,
        }}
      >
        {imgLoading && (
          <div
            style={{
              height: 400,
              objectFit: "cover",
              width: "100%",
              marginBottom: 16,
            }}
            className="shine"
          />
        )}
        {console.log(data.description)}
        <img
          alt="Avatar"
          src={
            data.image && data.image !== "placeholder"
              ? data.image
              : require("../../../assets/fallback.jpg")
          }
          style={{
            height: imgLoading ? 0 : 400,
            objectFit: "cover",
            width: "100%",
            marginBottom: 16,
          }}
          onLoad={() => setImgLoading(false)}
          onError={() => setImgLoading(false)}
        />
        {data.title && (
          <h3
            style={{
              marginBottom: 16,
            }}
          >
            {data.title}
          </h3>
        )}
        {parser(data.description ? data.description : "")}
      </div>
    </div>
  );
}

export default View;
