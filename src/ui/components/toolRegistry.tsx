import React from "react";
import { Option1Tool } from "./tools/Option1Tool";
import { Option2Tool } from "./tools/Option2Tool";
import { LabelTool } from "./tools/LabelTool";
import { NavigationOption } from "./Navigation";

export const navigationOptions: NavigationOption[] = [
  { id: "option1", label: "Option 1" },
  { id: "option2", label: "Option2" },
  { id: "label", label: "Label" },
];

export const renderTool = (toolId: string | null): React.ReactNode => {
  switch (toolId) {
    case "option1":
      return <Option1Tool />;
    case "option2":
      return <Option2Tool />;
    case "label":
      return <LabelTool />;
    default:
      return null;
  }
};







