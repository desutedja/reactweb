import React, { useEffect, useState } from "react";
import { toThousand } from "../../../utils";
import AnimatedNumber from "animated-number-react";

const SummaryItem = ({ label, icon, data, download }) => {
  return (
    <div className="row">
      <div className={typeof icon !== "undefined" ? "col-8" : "col-12"}>
        <div
          className="ads-summary-label-text2 mt-1"
          style={{ textAlign: isNaN(data) ? "center" : "left" }}
        >
          {label}
        </div>
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
          <div className="ads-summary-data-text2">
            {/* <strong>{toThousand(data)}</strong> */}
            <AnimatedNumber
              className="h2 font-weight-bold black"
              value={data}
              formatValue={toThousand}
            />
          </div>
        )}
      </div>
    </div>
  );
};
export default SummaryItem;
