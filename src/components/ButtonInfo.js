import React, { useState } from "react";
import { Button } from "reactstrap";

function MyButton({ icon, onClick, color, disabled, className, positionTooltip, message }) {
  const [modalHover, setModalHover] = useState(false);
  return (
    <>
      <div className="info-modal-hover">
        <Button
          className={
            "ButtonInformation " +
            (disabled ? "inactive" : color ? color : "") +
            (className ? " " + className : "")
          }
          disabled={disabled}
          onClick={onClick}
          style={{
            paddingRight: 10,
            paddingLeft: 10,
            marginRight: 4,
            marginLeft: 4,
            marginBottom: 8,
            backgroundColor: color ? "" : "#244091",
            borderRadius: 6,
          }}
          onMouseEnter={() => setModalHover(true)}
          onMouseLeave={() => setModalHover(false)}
        >
          {icon && (
            <span
              style={{
                marginBottom: 2,
              }}
            >
              {icon}
            </span>
          )}
        </Button>
        <div
          className={"list-modal-hover-wizard " + positionTooltip + (modalHover ? " on" : "")}
          style={{ color: "#FFFFFF", opacity: "100%", fontSize: "12px"}}
          onMouseEnter={() => setModalHover(true)}
          onMouseLeave={() => setModalHover(false)}
          dangerouslySetInnerHTML={{__html: message}}
        >
        </div>
      </div>
    </>
  );
}

export default MyButton;
