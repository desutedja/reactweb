import React, { useEffect, useState } from "react";
import { toThousand } from "../../../utils";

const SummaryItem = ({ label, icon, data, download }) => {
  return (
    <div className="row">
      {typeof icon !== "undefined" && (
        <div className="col-4 ads-summary-icon-container">
          <img src={icon} className="ads-summary-icon" />
        </div>
      )}
      <div className={typeof icon !== "undefined" ? "col-8" : "col-12"}>
        {isNaN(data) ? (
          <div>
            <a
              style={{ cursor: "pointer" }}
              className="ads-summary-icon-container"
              //   href={download}
              onClick={download}
            >
              <div className="col-4 ads-summary-icon-container">
                <img src={data} className="ads-summary-icon" />
              </div>
            </a>
          </div>
        ) : (
          <div className="ads-summary-data-text">
            <strong>{toThousand(data)}</strong>
          </div>
        )}
        <div
          className="ads-summary-label-text mt-1"
          style={{ textAlign: isNaN(data) ? "center" : "left" }}
        >
          {label}
        </div>
      </div>
    </div>
  );
};
export default SummaryItem;
