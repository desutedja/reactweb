import React from "react";
import ClinkLoader from "./ClinkLoader";

function Loading({
  loading,
  size = null,
  children = null,
  style = {
    position: "fixed",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffffc5",
    zIndex: 2,
  },
}) {
  return loading ? (
    <div className="Spinner" style={style}>
      <ClinkLoader />
    </div>
  ) : (
    children
  );
}

export default Loading;
