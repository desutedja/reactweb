import React from 'react';
import './ClinkLoader.css';

import clinkLogo from '../assets/yipy-logo-color.png';
// import clinkLogo from '../assets/clink_logo_small.png';

export default () => {
  return (
    <div style={{ textAlign: "left" }}>
        <div className="clink-loader breath d-inline-block">
          <img
            // className="roll"
            src={clinkLogo} alt="Centratama Loading - Clink"/>
        </div>
        <div style={{ paddingTop: '5px', marginLeft: '-8px' }}>please wait...</div>
    </div>
  )
}
