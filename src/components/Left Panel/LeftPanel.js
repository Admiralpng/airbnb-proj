import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import "./LeftPanel.css";
import "../../Responsive Styles/ResponsiveLeftPanel.css";

export const LeftPanel = ({ onOpenBookings, onSelectLocation }) => {
  const [panelWidth, setPanelWidth] = useState (80)
  const [hiddenMenuBtn, setHiddenMenuBtn] = useState(false)
  const [location, setLocation] = useState(false)
  
  const openBookings = onOpenBookings;
  const selectLocation = onSelectLocation;

  const overPanelHandler = (event) => {
    setPanelWidth((prevWidth) => prevWidth + 85)
    setHiddenMenuBtn(true)
    setLocation(true)
  };
  const outPanelHandler = (event) => {
    setPanelWidth((prevWidth) => prevWidth - 85);
    setHiddenMenuBtn(false);
    setLocation(false);
  };

  const menuBtnSpacing = 10;
  const overMenuBtnHandler = (event) => {
    setHiddenMenuBtn(true);
  };
  const outMenuBtnHandler = (event) => {
    setHiddenMenuBtn(false);
  };

  
  return (
    <div className="left-panel" style={{width:`${panelWidth}px`}} onMouseOver={overPanelHandler} onMouseOut={outPanelHandler}>
      <button type="button" aria-label="Locations" onClick={selectLocation}>
        <img src="https://cdn-icons-png.flaticon.com/128/3086/3086454.png" alt="Locations" />
        <span style={{display:`${hiddenMenuBtn ? 'flex' : 'none'}`, marginLeft: `${menuBtnSpacing}px`}} onMouseOver={overMenuBtnHandler} onMouseOut={outMenuBtnHandler}>Locations</span>
      </button>
      <button type="button" aria-label="Saved Bookings" onClick={openBookings}>
        <img src="https://cdn-icons-png.flaticon.com/128/7322/7322293.png" alt="Bookings" />
        <span style={{display:`${hiddenMenuBtn ? 'flex' : 'none'}`, marginLeft: `${menuBtnSpacing}px`}} onMouseOver={overMenuBtnHandler} onMouseOut={outMenuBtnHandler}>Bookings</span>
      </button>
      <Link to="/services">
        <img src="https://cdn-icons-png.flaticon.com/128/4915/4915992.png" alt="Services" />
        <span style={{display:`${hiddenMenuBtn ? 'flex' : 'none'}`, marginLeft: `${menuBtnSpacing}px`}} onMouseOver={overMenuBtnHandler} onMouseOut={outMenuBtnHandler}>Services</span>
      </Link>
    </div>
  )
}
