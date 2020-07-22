import React from 'react';
import './ClinkLoader.css';

import clinkLogo from '../assets/clink_logo_small.png';

export default () => {
  return (
    <div className="clink-loader breath d-inline-block">
      <img className="roll" src={clinkLogo} alt="Centratama Loading - Clink"/>
    </div>
  )
}
