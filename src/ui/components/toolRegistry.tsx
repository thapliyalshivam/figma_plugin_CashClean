import React from "react";
import {
  AlignerTool,
  Option4Tool,
  LoosePointTool,
  CopycatTool,
  CopyAndDesTool,
} from "./tools";

/** One main tab in the feature header (e.g. Copy, Layout). */
export interface MainNavOption {
  id: string;
  label: string;
  subFeatures: SubFeatureOption[];
}

/** One sub-feature under a main tab. */
export interface SubFeatureOption {
  id: string;
  label: string;
}

export const mainNavOptions: MainNavOption[] = [
  {
    id: "copy",
    label: "Copy",
    subFeatures: [
      { id: "copycat", label: "Copycat" },
      { id: "copyanddes", label: "Copy and Des" },
    ],
  },
  {
    id: "layout",
    label: "Layout",
    subFeatures: [
      { id: "aligner", label: "Aligner" },
      { id: "loosepoint", label: "Loose point" },
      { id: "option4", label: "Option 4" },
    ],
  },
];

export function renderSubFeature(subFeatureId: string | null): React.ReactNode {
  switch (subFeatureId) {
    case "copycat":
      return <CopycatTool />;
    case "copyanddes":
      return <CopyAndDesTool />;
    case "option4":
      return <Option4Tool />;
    case "aligner":
      return <AlignerTool />;
    case "loosepoint":
      return <LoosePointTool />;
    default:
      return null;
  }
}

