import React from "react";
import "./ToolBase.css";

export const Option2Tool: React.FC = () => {
  const handleAction = () => {
    // Tool-specific logic here
    parent.postMessage(
      { pluginMessage: { type: "option2-action" } },
      "*"
    );
  };

  return (
    <div className="tool-container">
      <h2 className="tool-title">Option 2 Tool</h2>
      <p className="tool-description">
        This is the tool component for Option 2. Add your specific functionality here.
      </p>
      <button className="tool-button" onClick={handleAction}>
        Execute Option 2
      </button>
    </div>
  );
};







