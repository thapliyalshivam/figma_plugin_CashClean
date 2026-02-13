import React from "react";
import "./Header.css";
import logoUrl from "../assets/logo.png";

export const Header: React.FC = () => {
  return (
    <div className="plugin-header-container">
      <div className="plugin-logo">
        <div className="plugin-logo-icon">
          <img src={logoUrl} alt="Logo" className="plugin-logo-img" />
        </div>
      </div>
      <div className="plugin-title-container">
        <h1 className="plugin-title">Cashmere Tool</h1>
      </div>
    </div>
  );
};







