import React from "react";
import "./Option5Tool.css";

export const Option5Tool: React.FC = () => {
  const handleSubmit = () => {
    parent.postMessage({ pluginMessage: { type: "option5-action" } }, "*");
  };

  return (
    <div className="option5-tool-container">
      <p className="option5-tool-description">
        Select a frame or group, then click Submit. Copycat finds all text inside
        (including in nested groups and frames) and uses Google Gemini to fix
        grammar and punctuation.
      </p>
      <button className="option5-submit-button" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
};
