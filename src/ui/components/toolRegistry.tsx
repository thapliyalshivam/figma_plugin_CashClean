import React from "react";
import {
  Option1Tool,
  Option2Tool,
  LabelTool,
  Option4Tool,
  Option5Tool,
} from "./tools";
import { NavigationOption } from "./Navigation";

export const navigationOptions: NavigationOption[] = [
  { id: "option1", label: "Option 1" },
  { id: "option2", label: "Aligner" },
  { id: "label", label: "Label" },
  { id: "option4", label: "Option 4" },
  { id: "option5", label: "Copycat" },
];

export const renderTool = (toolId: string | null): React.ReactNode => {
  switch (toolId) {
    case "option1":
      return <Option1Tool />;
    case "option2":
      return <Option2Tool />;
    case "label":
      return <LabelTool />;
    case "option4":
      return <Option4Tool />;
    case "option5":
      return <Option5Tool />;
    default:
      return null;
  }
};







