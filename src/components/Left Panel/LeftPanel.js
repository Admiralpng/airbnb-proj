import React from 'react';
import { useState } from 'react';
import "./LeftPanel.css"

export const LeftPanel = () => {
  const [panelWidth, setPanelWidth] = useState (80)
  
  const overPanelHandler = (event) => {
    setPanelWidth((prevWidth) => prevWidth + 40)
  };

  const outPanelHandler = (event) => {
    setPanelWidth((prevWidth) => prevWidth - 40)
  };
  
  return (
    <div className="left-panel" style={{width:`${panelWidth}px`}} onMouseOver={overPanelHandler} onMouseOut={outPanelHandler}>
      <button><span>Locations</span></button>
      <button><span>All</span></button>
      <button><span>Services</span></button>
    </div>
  )
}
