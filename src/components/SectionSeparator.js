import React from "react";

function Component({ className = "", title = "", style }) {
  return (
    <div style={{ ...style }} className={"SectionSeparator " + className}>
      <h5>{title}</h5>
    </div>
  );
}

export default Component;
