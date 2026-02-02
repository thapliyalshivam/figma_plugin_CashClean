// Figma Plugin main code

// Declare the globals provided by webpack bundler
declare const __html__: string;

// Import handlers and types
import {
  PluginMessage,
  handleCreateRectangles,
  handleClosePlugin,
  handleOption1Action,
  handleOption2Action,
  handleLabelAction,
  handleOption4Action,
} from "./handlers";

// Render the React UI inside the plugin window
figma.showUI(__html__, { width: 420, height: 500 });

// Listen for messages from the UI and handle tool actions
figma.ui.onmessage = (msg: PluginMessage) => {
  switch (msg.type) {
    case "create-rectangles":
      handleCreateRectangles();
      break;

    case "close-plugin":
      handleClosePlugin();
      break;

    case "option1-action":
      handleOption1Action();
      break;

    case "option2-action":
      handleOption2Action();
      break;

    case "label-action":
      handleLabelAction();
      break;

    case "option4-action":
      handleOption4Action(msg.style || "fill");
      break;

    default:
      console.warn(`Unknown message type: ${(msg as any).type}`);
  }
};



