import React from "react";
import "./ToolBase.css";

export const LabelTool: React.FC = () => {
  const handleAction = () => {
    // Tool-specific logic here
    parent.postMessage(
      { pluginMessage: { type: "label-action" } },
      "*"
    );
  };

  return (
    <div className="tool-container">
      <h2 className="tool-title">Label Tool</h2>
      <p className="tool-description">
        This is the tool component for Label. Add your specific functionality here.
      </p>
      <button className="tool-button" onClick={handleAction}>
        Execute Label Tool
      </button>
    </div>
  );
};







