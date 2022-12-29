import React from "react";
import { Badge } from "reactstrap";

function Component({
  color,
  children,
  minWidth,
  padding,
  borderRadius,
}) {
  return (
    <h5 style={{ marginBottom: "0" }}>
      <Badge
        style={{
          minWidth: minWidth,
          padding: padding,
          borderRadius: borderRadius,
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
