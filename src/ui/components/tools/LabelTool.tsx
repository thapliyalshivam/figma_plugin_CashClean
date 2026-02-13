import React from "react";
import { SubFeatureLayout } from "../SubFeatureLayout";

export const LabelTool: React.FC = () => {
  const handleAction = () => {
    parent.postMessage(
      { pluginMessage: { type: "label-action" } },
      "*"
    );
  };

  return (
    <SubFeatureLayout
      headline="Label Tool"
      copy="This is the tool component for Label. Add your specific functionality here."
      actionRow={
        <button className="subfeature-btn" onClick={handleAction}>
          Execute Label Tool
        </button>
      }
    />
  );
};







