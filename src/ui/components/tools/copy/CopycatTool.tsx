import React from "react";
import { SubFeatureLayout } from "../../SubFeatureLayout";

export const CopycatTool: React.FC = () => {
  const handleSubmit = () => {
    parent.postMessage({ pluginMessage: { type: "option5-action" } }, "*");
  };

  return (
    <SubFeatureLayout
      headline="Copycat"
      copy="Select a frame or group, then click Submit. Copycat finds all text inside (including in nested groups and frames) and uses Google Gemini to fix grammar and punctuation."
      actionRow={
        <button className="subfeature-btn" onClick={handleSubmit}>
          Submit
        </button>
      }
    />
  );
};
