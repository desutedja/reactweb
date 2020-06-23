import React, { useState } from 'react';

function Component({ labels = [], contents = [] }) {
    const [active, setActive] = useState(0);

    return (
        <div style={{
            width: '100%',
        }}>
            <div className="Tab">
                {labels.map((el, index) =>
                    <div key={el} className="TabItem" onClick={() => setActive(index)}>
                        <div className={active === index ? "TabItem-Text" : "TabItem-Text-inactive"}>
                            {el}
                        </div>
                        {active === index && <div className="TabIndicator"></div>}
                    </div>
                )}
            </div>
            {contents[active]}
        </div>
    )
}

export default Component;