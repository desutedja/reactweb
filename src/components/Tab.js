import React, { useState } from "react";

function Component({
  labels = [],
  contents = [],
  activeTab = 0,
  setTab = null,
  tabActive = null,
  title,
}) {
  const [active, setActive] = useState(activeTab);

  return (
    <div
      style={{
        flex: 1,
        width: "100%",
        overflow: "auto",
        // fontWeight: "bolder"
      }}
    >
      {title && <div className="Title">{title}</div>}
      {labels.length > 1 && (
        <div className="Tab">
          {labels.map((el, index) => (
            <div
              style={{ width: `${100 / labels.length}%` }}
              key={el}
              className="TabItem"
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
                style={{ fontWeight: "bolder" }}
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
