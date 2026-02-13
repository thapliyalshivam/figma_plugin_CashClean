// Figma Plugin main code

// Declare the globals provided by webpack bundler
declare const __html__: string;

// Import handlers and types
import {
  PluginMessage,
  handleCreateRectangles,
  handleClosePlugin,
  handleOption2Action,
  handleLabelAction,
  handleOption4Action,
  handleCopycatAction,
  handleCopyAndDesAction,
  handleLoosePointAction,
} from "./handlers";

// Render the React UI inside the plugin window
figma.showUI(__html__, { width: 420, height: 500 });

// Listen for messages from the UI and handle tool actions
figma.ui.onmessage = async (msg: PluginMessage) => {
  switch (msg.type) {
    case "create-rectangles":
      handleCreateRectangles();
      break;

    case "close-plugin":
      handleClosePlugin();
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

    case "option5-action":
      await handleCopycatAction();
      break;

    case "copyanddes-action":
      await handleCopyAndDesAction(msg.docContent ?? "", msg.docUrl);
      break;

    case "loose-point-action":
      handleLoosePointAction();
      break;

    default:
      console.warn(`Unknown message type: ${(msg as any).type}`);
  }
};



