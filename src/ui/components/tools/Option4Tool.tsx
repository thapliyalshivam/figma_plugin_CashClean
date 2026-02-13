import React, { useState } from "react";
import "./Option4Tool.css";

export const Option4Tool: React.FC = () => {
  const [selectedStyle, setSelectedStyle] = useState<"fill" | "stroke">("fill");

  const handleStyleChange = (style: "fill" | "stroke") => {
    setSelectedStyle(style);
  };

  const handleSubmit = () => {
    // Tool-specific logic here
    parent.postMessage(
      { pluginMessage: { type: "option4-action", style: selectedStyle } },
      "*"
    );
  };

  return (
    <div className="option4-tool-container">
      <div className="option4-tool-buttons">
        <button
          className={`option4-style-button ${
            selectedStyle === "fill" ? "option4-style-button--active" : ""
          }`}
          onClick={() => handleStyleChange("fill")}
        >
          <span className="option4-style-button-text">Fill style</span>
        </button>
        <button
          className={`option4-style-button ${
            selectedStyle === "stroke" ? "option4-style-button--active" : ""
          }`}
          onClick={() => handleStyleChange("stroke")}
        >
          <span className="option4-style-button-text">Stroke 1</span>
        </button>
      </div>
      <p className="option4-tool-description">
        This is the tool component for Option 1. Add your specific functionality
        here.
      </p>
        <button className="option4-submit-button" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
};
