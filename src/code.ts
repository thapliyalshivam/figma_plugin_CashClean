// Figma Plugin main code

// Declare the globals provided by the Figma runtime and webpack bundler
declare const figma: any;
declare const __html__: string;

type PluginMessage = {
  type:
    | "create-rectangles"
    | "close-plugin"
    | "option1-action"
    | "option2-action"
    | "label-action";
};

// Render the React UI inside the plugin window
figma.showUI(__html__, { width: 220, height: 500 });

/**
 * Aligns all selected elements to the top (minimum Y position)
 */
function alignSelectedElementsToTop(): void {
  const selection = figma.currentPage.selection;

  // Check if there are any selected elements
  if (selection.length === 0) {
    figma.notify("Please select at least one element to align");
    return;
  }

  // Find the minimum Y position (topmost element)
  let minY = Infinity;
  for (const node of selection) {
    if ("y" in node && typeof node.y === "number") {
      minY = Math.min(minY, node.y);
    }
  }

  // If no valid Y positions found, exit
  if (minY === Infinity) {
    figma.notify("Unable to align: selected elements don't have valid positions");
    return;
  }

  // Align all selected elements to the top
  for (const node of selection) {
    if ("y" in node && typeof node.y === "number") {
      node.y = minY;
    }
  }

  figma.notify(`Aligned ${selection.length} element(s) to top`);
}

// Listen for messages from the UI and handle tool actions
figma.ui.onmessage = (msg: PluginMessage) => {
  if (msg.type === "create-rectangles") {
    const rect1 = figma.createRectangle();
    rect1.resize(150, 100);
    rect1.fills = [{ type: "SOLID", color: { r: 0.2, g: 0.6, b: 0.86 } }];
    rect1.x = 0;
    rect1.y = 0;

    const rect2 = figma.createRectangle();
    rect2.resize(150, 100);
    rect2.fills = [{ type: "SOLID", color: { r: 0.9, g: 0.4, b: 0.3 } }];
    rect2.x = rect1.x + rect1.width + 40;
    rect2.y = rect1.y;

    figma.currentPage.selection = [rect1, rect2];
    figma.viewport.scrollAndZoomIntoView([rect1, rect2]);
  }

  if (msg.type === "close-plugin") {
    figma.closePlugin();
  }

  // Handle tool-specific actions
  if (msg.type === "option1-action") {
    alignSelectedElementsToTop();
  }

  if (msg.type === "option2-action") {
    // Add Option 2 tool logic here
    console.log("Option 2 action triggered");
  }

  if (msg.type === "label-action") {
    // Add Label tool logic here
    console.log("Label action triggered");
  }
};


