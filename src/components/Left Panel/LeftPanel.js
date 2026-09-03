import React from 'react';
import { useState } from 'react';
import "./LeftPanel.css"

export const LeftPanel = () => {
  const [panelWidth, setPanelWidth] = useState (80)
  const [hiddenMenuBtn, setHiddenMenuBtn] = useState(false)
  
  const overPanelHandler = (event) => {
    setPanelWidth((prevWidth) => prevWidth + 85)
    setHiddenMenuBtn(true)
  };
  const overMenuBtnHandler = (event) => {
    setHiddenMenuBtn(true)
  };

  const outPanelHandler = (event) => {
    setPanelWidth((prevWidth) => prevWidth - 85)
    setHiddenMenuBtn(false)
  };
  const outMenuBtnHandler = (event) => {
    setHiddenMenuBtn(false)
  };
  
  return (
    <div className="left-panel" style={{width:`${panelWidth}px`}} onMouseOver={overPanelHandler} onMouseOut={outPanelHandler}>
      <button>
        <img src="https://cdn-icons-png.flaticon.com/128/3086/3086454.png" alt="Locations" />
        <span style={{display:`${hiddenMenuBtn ? 'flex' : 'none'}`}} onMouseOver={overMenuBtnHandler} onMouseOut={outMenuBtnHandler}>Locations</span>
      </button>
      <button><span>All</span></button>
      <button><span>Services</span></button>
    </div>
  )
}
