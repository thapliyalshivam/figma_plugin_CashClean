import React from "react";
import "./SubFeatureLayout.css";

export interface SubFeatureLayoutProps {
  /** Headline (e.g. tool name) */
  headline: React.ReactNode;
  /** Copy / description body */
  copy: React.ReactNode;
  /** Action row: buttons, controls */
  actionRow: React.ReactNode;
}

/**
 * Sub-feature layout with three parts: Headline, Copy, and Action row.
 * Use for tool panels and similar content blocks.
 */
export const SubFeatureLayout: React.FC<SubFeatureLayoutProps> = ({
  headline,
  copy,
  actionRow,
}) => {
  return (
    <div className="subfeature-layout">
      <div className="subfeature-headline">{headline}</div>
      <div className="subfeature-copy">{copy}</div>
      <div className="subfeature-action-row">{actionRow}</div>
    </div>
  );
};
