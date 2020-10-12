import React from "react";
import Avatar from "react-avatar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import "./style.css";

function Component({ id, data, noThumbnail, disabled }) {
  const { role } = useSelector((state) => state.auth);
  const content = (
    <>
      {typeof noThumbnail === "undefined" && (
        <Avatar
          className="Item-avatar"
          size="40"
          src={data.thumbnails}
          name={data.name}
        />
      )}
      <span> </span>
      <div>
        <b>{data.name}</b>
        <p className="Item-subtext">
          <i>{data.merchant_name}</i>
        </p>
      </div>
    </>
  );
  if (typeof disabled !== "undefined") {
    return <span>{content}</span>;
  }
  return (
    <Link
      aria-disabled="true"
      to={"/" + role + "/product/" + id}
      className="Item"
    >
      {content}
    </Link>
  );
}

export default Component;
