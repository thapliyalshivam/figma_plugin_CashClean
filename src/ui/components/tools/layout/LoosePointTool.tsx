import React from "react";
import { SubFeatureLayout } from "../../SubFeatureLayout";

export const LoosePointTool: React.FC = () => {
  const handleAction = () => {
    parent.postMessage(
      { pluginMessage: { type: "loose-point-action" } },
      "*"
    );
  };

  return (
    <SubFeatureLayout
      headline="Loose point"
      copy="This feature will remove all the loose point positioning in the design to even number."
      actionRow={
        <button className="subfeature-btn" onClick={handleAction}>
          Loose it all
        </button>
      }
    />
  );
};
