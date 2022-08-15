import React, { useState } from "react";
import { Button } from "reactstrap";

function MyButton({ icon, onClick, color, disabled, className }) {
  const [modalHover, setModalHover] = useState(false);
  return (
    <>
      <div className="modal-hover">
        <Button
          className={
            "ButtonWizard " +
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
          className={"list-modal-hover-wizard" + (modalHover ? " on" : "")}
          style={{ color: "#FFFFFF", opacity: "100%", fontSize: "12px"}}
          onMouseEnter={() => setModalHover(true)}
          onMouseLeave={() => setModalHover(false)}
        >
          Pelajari Selengkapnya
        </div>
      </div>
    </>
  );
}

export default MyButton;
