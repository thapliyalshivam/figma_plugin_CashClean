import React, { useState } from "react";
import { SubFeatureLayout } from "../../SubFeatureLayout";
import "./Option4Tool.css";

export const Option4Tool: React.FC = () => {
  const [selectedStyle, setSelectedStyle] = useState<"fill" | "stroke">("fill");

  const handleStyleChange = (style: "fill" | "stroke") => {
    setSelectedStyle(style);
  };

  const handleSubmit = () => {
    parent.postMessage(
      { pluginMessage: { type: "option4-action", style: selectedStyle } },
      "*"
    );
  };

  return (
    <SubFeatureLayout
      headline="Option 4"
      copy="Normalize vector anchor points: snap nearby anchors so coincident points align. Select vector shapes or the whole page, then Submit."
      actionRow={
        <>
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
          <button className="subfeature-btn" onClick={handleSubmit}>
            Submit
          </button>
        </>
      }
    />
  );
};
