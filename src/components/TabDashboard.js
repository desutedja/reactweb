import React, { useState } from "react";

function Component({
  labels = [],
  contents = [],
  activeTab = 0,
  setTab = null,
  tabActive = null,
}) {
  const [active, setActive] = useState(activeTab);

  return (
    <div
      style={{
        flex: 1,
        width: "100%",
        // overflow: "auto",
        // fontWeight: "bolder"
      }}
    >
      {labels.length > 1 && (
        <div className="TabDashboard">
          {labels.map((el, index) => (
            <div
              style={{ width: `${100 / labels.length}%` }}
              key={el}
              className="TabItemDashboard"
              onClick={() => {
                setTab && setTab(el.toLowerCase());
                tabActive && tabActive(0);
                setActive(index);
              }}
            >
              <div
                className={
                  active === index ? "TabItem-Text" : "TabItem-Text-inactive"
                }
                style={{paddingLeft:10}}
              >
                {el}
              </div>
              {active === index && <div className="TabIndicator"></div>}
            </div>
          ))}
        </div>
      )}
      {contents[active]}
    </div>
  );
}

export default Component;
