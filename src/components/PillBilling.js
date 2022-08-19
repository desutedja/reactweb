import React from "react";
import { Badge } from "reactstrap";

function Component({ color, children, minWidth, paddingTop, paddingBottom }) {
  return (
    <h5 style={{ marginBottom: "0" }}>
      <Badge
        style={{
          minWidth: minWidth,
          paddingTop: paddingTop,
          paddingBottom: paddingBottom,
        }}
        pill
        color={color}
      >
        {children}
      </Badge>
    </h5>
  );
}

export default Component;
