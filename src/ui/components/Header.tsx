import React from "react";
import "./Header.css";

export const Header: React.FC = () => {
  return (
    <div className="plugin-header-container">
      <div className="plugin-logo">
        <div className="plugin-logo-icon">
          {/* Logo placeholder - you can replace this with actual logo SVG */}
          <div className="logo-cylinder">
            <div className="logo-top"></div>
            <div className="logo-body"></div>
            <div className="logo-label">XAMON</div>
          </div>
        </div>
      </div>
      <div className="plugin-title-container">
        <h1 className="plugin-title">Illustrator Plugin</h1>
      </div>
    </div>
  );
};







