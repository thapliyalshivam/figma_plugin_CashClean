import React from "react";
import { SubFeatureLayout } from "../../SubFeatureLayout";

export const AlignerTool: React.FC = () => {
  const handleAction = () => {
    parent.postMessage(
      { pluginMessage: { type: "option2-action" } },
      "*"
    );
  };

  return (
    <SubFeatureLayout
      headline="Aligner"
      copy="Select images. We create frames with median dimensions, fill and center the images, then arrange them in a grid."
      actionRow={
        <button className="subfeature-btn" onClick={handleAction}>
          Execute Aligner
        </button>
      }
    />
  );
};
