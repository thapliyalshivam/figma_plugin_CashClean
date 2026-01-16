import React from "react";
import "./ToolBase.css";

export const Option1Tool: React.FC = () => {
  const handleAction = () => {
    // Tool-specific logic here
    parent.postMessage(
      { pluginMessage: { type: "option1-action" } },
      "*"
    );
  };

  return (
    <div className="tool-container">
      <h2 className="tool-title">Option 1 Tool</h2>
      <p className="tool-description">
        This is the tool component for Option 1. Add sssyour specific functionality here.
      </p>
      <button className="tool-button" onClick={handleAction}>
        Execute Option 1
      </button>
    </div>
  );
};







