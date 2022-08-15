import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Facilities({ items, id, data }) {
  const { role } = useSelector((state) => state.auth);

  return (
    <Link
      to={"/" + role + "/facility booking/facilities/" + id}
      style={{ display: "block", textDecoration: "none", color: "#00000" }}
      className="Item"
    >
      {items.map((el, i) => (
        <div key={i}>{i === 0 ? <b>{el}</b> : <>{el}</>}</div>
      ))}
    </Link>
  );
}

export default Facilities;
