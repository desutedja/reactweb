import React from "react";

function Component({ className = "", title = "", style }) {
  return (
    <div style={{ ...style }} className={"SectionSeparator2" + className}>
      <h5 className="Separator2Label">{title}</h5>
    </div>
  );
}

export default Component;
